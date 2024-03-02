import { useState, useEffect } from 'react'
import { FaSpotify } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { FaPlay } from "react-icons/fa";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import GenreCombobox from './combobox';
import { CSSTransition } from 'react-transition-group';
import MarketCombobox from './marketbox';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET

function App() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([])
  const [noAlbums, setNoAlbums] = useState(false);

  useEffect(() => {
    var authparameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials&client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET
    }
    fetch("https://accounts.spotify.com/api/token", authparameters)
      .then(response => response.json())
      .then(data => {
        setAccessToken(data.access_token)
      })
  }, [])

  async function fetchLessPopularArtistsFirstAlbums() {
    if (!accessToken) return; // Ensure access token is available
  
    let offset = 0;
    const limit = 50;
    let hasMore = true;
    let firstAlbums = [];
    let popularityThreshold = 30; // Start from a lower popularity threshold
    const maxPopularity = 70; // Maximum popularity threshold to consider
    const popularityIncrement = 10; // How much to increase the popularity threshold each time
  
    const headers = { Authorization: `Bearer ${accessToken}` };
  
    let increment = 0;
    let retryDelay = 1000; // Start with a 1 second delay
    const maxRetries = 5; // Maximum number of retries after hitting rate limit
  
    while (hasMore && popularityThreshold <= maxPopularity) {
      console.log(firstAlbums.length)
      increment += 1;
      if (increment > 50) {
        break;
      }
  
      let retries = 0; // Track the number of retries
      while (retries < maxRetries) {
        try {
          const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=genre:"${selectedGenre}"&type=artist&limit=${limit}&offset=${offset}`, { headers });
  
          if (searchResponse.status === 429) { // Too Many Requests
            throw new Error('Rate limit exceeded');
          }
  
          const searchData = await searchResponse.json();
  
          let smallArtists = searchData.artists.items.filter(artist => artist.popularity <= popularityThreshold);
  
          if (smallArtists.length === 0 && popularityThreshold < maxPopularity) {
            popularityThreshold += popularityIncrement;
            continue; // Skip the rest of the loop and try again with a higher popularity threshold
          }
  
          const firstAlbumsPromises = smallArtists.map(async artist => {
            const albumsResponse = await fetch(`https://api.spotify.com/v1/artists/${artist.id}/albums?market=${selectedCountry}&limit=50`, { headers });
            if (albumsResponse.status === 429) {
              throw new Error('Rate limit exceeded');
            }
            const albumsData = await albumsResponse.json();
            const sortedAlbums = albumsData.items.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            return sortedAlbums[0]; // Assuming at least one album is present
          });
  
          const newFirstAlbums = await Promise.all(firstAlbumsPromises);
          firstAlbums = firstAlbums.concat(newFirstAlbums.filter(album => album));

          console.log(firstAlbums.length)
  
          offset += limit;
          if (searchData.artists.items.length < limit || firstAlbums.length > 200) {
            hasMore = false; // Stop if the current batch is smaller than the limit, indicating the end of the list
          } else if (smallArtists.length > 0) {
            popularityThreshold = 20;
          }
  
          break; // Exit retry loop on success
        } catch (error) {
          if (error.message === 'Rate limit exceeded' && retries < maxRetries) {
            console.log(`Rate limit exceeded, waiting ${retryDelay}ms before retrying...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            retryDelay *= 2; // Exponential backoff
            retries += 1;
          } else {
            throw error; // Rethrow error if not rate limit or max retries reached
          }
        }
      }
    }
  
    const uniqueFirstAlbums = Array.from(new Set(firstAlbums.map(album => album.id))).map(id => firstAlbums.find(album => album.id === id));
    setAlbums(uniqueFirstAlbums.sort((a, b) => new Date(b.release_date) - new Date(a.release_date)));
  
    if (firstAlbums.length === 0) {
      setNoAlbums(true);
    }
  }

  async function search() {
    if (!accessToken) return; // Ensure access token is available

    setAlbums([]);
    setNoAlbums(false);

    const parameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
      },
    };

    // Initialize an empty map to track unique albums
    const uniqueAlbumsMap = new Map();

    // Search for artists matching the search input
    const artistSearchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchInput)}&type=artist&limit=1&market=${selectedCountry}`;

    try {
      const artistResponse = await fetch(artistSearchUrl, parameters);
      const artistData = await artistResponse.json();
      if (artistData.artists.items.length > 0) {
        const artistID = artistData.artists.items[0].id;
        const artistAlbumsUrl = `https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=${selectedCountry}&limit=50`;
        const albumsResponse = await fetch(artistAlbumsUrl, parameters);
        const albumsData = await albumsResponse.json();
        // Add artist's albums to the map to ensure uniqueness
        albumsData.items.forEach(album => uniqueAlbumsMap.set(album.id, album));
      }
    } catch (error) {
      console.error("Error fetching artist albums:", error);
    }
    // Directly search for albums matching the search input
    const albumSearchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchInput)}&type=album&limit=50&market=${selectedCountry}`;

    try {
      const searchResponse = await fetch(albumSearchUrl, parameters);
      const searchData = await searchResponse.json();
      // Add directly searched albums to the map to ensure uniqueness
      searchData.albums.items.forEach(album => uniqueAlbumsMap.set(album.id, album));
    } catch (error) {
      console.error("Error fetching albums directly:", error);
    }

    // Convert the map back to an array and sort all albums by release date (newest first)
    const combinedAndUniqueAlbums = Array.from(uniqueAlbumsMap.values()).sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

    // Update your state or UI with the combined, unique, and sorted albums
    setAlbums(combinedAndUniqueAlbums);

    if (combinedAndUniqueAlbums.length === 0) {
      setNoAlbums(true);
    }
  }

  // Call the new function after the access token is set
  useEffect(() => {
    if (accessToken && selectedGenre !== '') {
      setAlbums([]);
      setNoAlbums(false);
      fetchLessPopularArtistsFirstAlbums();
    }
  }, [accessToken, selectedGenre, selectedCountry]);

  // style={{ background: 'linear-gradient(to right, #1DB954CC, #17E9E0CC)'}}


  return (
    <div className="w-full min-h-screen bg-spotify-dark overflow-x-hidden" >
      <div className={`h-full ${isSidebarOpen ? "w-64" : "w-20"} bg-spotify-dark-gray duration-300 p-4 flex flex-col justify-between fixed opacity-100 z-40`}>
        <div>
          <div className="cursor-pointer flex justify-center" onClick={() => setIsSidebarOpen(!isSidebarOpen)} >
            <div className="flex items-center h-16 w-full justify-center">
              <TbPlayerTrackNextFilled className={`w-10 h-10 text-spotify-green duration-300 hover:scale-110 ${isSidebarOpen ? "rotate-180" : ""}`}/>
            </div>
          </div>

          <div className="mt-4 mb-6">
            <p className="text-spotify-light font-bold">FILTERS</p>
            <GenreCombobox setSelectedGenre={setSelectedGenre}/>
          </div>

          <div className="mb-6">
            <p className="text-spotify-light font-bold text-sm">MARKET</p>
            <MarketCombobox setSelectedMarket={setSelectedCountry}/>
          </div>

          <div className="mb-6">
            <p className="text-spotify-light font-bold text-sm">DESCRIPTION</p>
            <p>
              Find new albums from less popular artists in a specific genre. Don't know what to listen to? Let us surprise you!
            </p>
          </div>

          {/* <div className="mb-6">
            <p className="text-spotify-light font-bold text-sm">SURPRISE ME!</p>
            <GenreCombobox setSelectedGenre={setSelectedGenre}/>
          </div> */}

        </div>
        <div className="flex items-center">
          <a href="https://www.spotify.com/" target="_blank" rel="noopener noreferrer" className="z-50 absolute w-12 h-12">
            <FaSpotify className="w-12 h-12 text-spotify-green hover:scale-110 duration-300"/>
          </a>
          <div className={`duration-300  z-0 ${isSidebarOpen ? "ml-[64px] opacity-100" : "ml-[0px] opacity-0"}`}>
            <p className="text-[1.75rem]" style={{ background: 'linear-gradient(to right, #1DB954, #17E9E0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              <span className="font-bold tracking-tighter">Spotify</span>
              <span className="font-light">Indie</span>
            </p>
          </div>
        </div>
      </div>

      <div className={`flex flex-col h-screen ${isSidebarOpen ? "pl-20 sm:pl-64" : "pl-20"} transition-all duration-300`}>
        <div className="h-96 max-w-full px-4 sm:px-6">

          <div className="w-full justify-center">
            <div className={`z-5 h-12 bg-spotify-dark-gray rounded-full flex duration-300 opacity-90 outline mt-6 ${isSearchFocused ? 'outline-spotify-white text-spotify-white' : 'text-spotify-light outline-spotify-dark'}`}>
              <BiSearch className="h-6 w-6 my-3 ml-5 mr-3"/>
              <input
                className="w-full h-full bg-transparent outline-none"
                placeholder="Find something new to listen to!"
                type="input"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onKeyPress={event => {
                  if (event.key === 'Enter') {
                    search();
                  }
                }}
                onChange={event => setSearchInput(event.target.value)}
              />
            </div>

            <div className="relative w-full mx-auto h-full">
              <div className="absolute flex items-center justify-center w-full h-96">
                <CSSTransition in={albums.length === 0 && !noAlbums} timeout={500} classNames="fade" unmountOnExit>
                  <div className="loader-dots block relative w-20 h-3 mt-2">
                    <div className="absolute top-0 w-2 h-2 rounded-full bg-spotify-green"></div>
                    <div className="absolute top-0 w-2 h-2 rounded-full bg-spotify-green"></div>
                    <div className="absolute top-0 w-2 h-2 rounded-full bg-spotify-green"></div>
                    <div className="absolute top-0 w-2 h-2 rounded-full bg-spotify-green"></div>
                  </div>
                </CSSTransition>
              </div>
            </div>
          </div>

          <CSSTransition in={albums.length === 0 && noAlbums} timeout={500} classNames="fade" unmountOnExit>
            <div className="w-full min-h-full flex items-center justify-center">
              <p className="text-spotify-light text-lg">No albums found.</p>
            </div>
          </CSSTransition>

          <CSSTransition in={albums.length > 0} timeout={500} classNames="fade" unmountOnExit>
            <div className="py-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 overflow-auto">
                {albums.map((album, index) => {
                  return (
                    // Grid item
                    <div key={index} className="bg-spotify-dark-gray rounded-xl overflow-hidden shadow-lg">
                      <div className="w-full relative">

                        <div className="absolute inset-0 flex justify-center items-center bg-spotify-dark-gray-transparent opacity-0 hover:opacity-100 duration-300">
                          <a href={album?.external_urls?.spotify} target="_blank" rel="noopener noreferrer">
                            <div className="rounded-full h-14 w-14 sm:h-24 sm:w-24 bg-spotify-green flex items-center justify-center hover:scale-110 duration-300">
                              <FaPlay className="ml-1 sm:ml-2 h-6 w-6 sm:h-10 sm:w-10"/>
                            </div>
                          </a>
                        </div>

                        <img className="w-full h-full" src={album?.images[0]?.url} alt={album?.name}/>
                      </div>
                      <div className="px-6 pt-4 pb-6">
                      <a href={album?.external_urls?.spotify} target="_blank" rel="noopener noreferrer">
                        <div className="font-bold text-lg mb-2 text-spotify-white glow-on-hover duration-300">
                          {album?.name}
                        </div>
                      </a>
                        <p className="text-spotify-light text-base">
                          {album?.artists.map((artist, index) => {
                            return (
                              <span key={index} className="mr-2 hover:text-spotify-white duration-300">
                                <a href={artist?.external_urls?.spotify} target="_blank" rel="noopener noreferrer">
                                  {artist?.name}
                                </a>
                              </span>
                            )
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CSSTransition>


        </div>
      </div>
    </div>
  )
}

export default App