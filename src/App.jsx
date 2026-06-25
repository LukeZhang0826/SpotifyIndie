import { useState, useEffect } from 'react'
import { FaSpotify } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { FaPlay } from "react-icons/fa";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import GenreCombobox from './combobox';
import { CSSTransition } from 'react-transition-group';
import MarketCombobox from './marketbox';
import { IoSparklesSharp } from "react-icons/io5";
import genres from './genres'
import { Analytics } from "@vercel/analytics/react"
import mixpanel from 'mixpanel-browser';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET

mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, { debug: true });



class RequestQueue {
  constructor(delay) {
    this.queue = [];
    this.delay = delay;
    this.isProcessing = false;
    this.processingCompleteResolver = null;
  }

  enqueue(task) {
    this.queue.push(task);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  async processQueue() {
    if (this.queue.length > 0) {
      this.isProcessing = true;
      const task = this.queue.shift();
      try {
        await task();
      } catch (err) {
        console.error('Queue task failed:', err);
      } finally {
        // Always continue the queue, even if a task threw, so whenEmpty() resolves.
        setTimeout(() => this.processQueue(), this.delay);
      }
    } else {
      this.isProcessing = false;
      if (this.processingCompleteResolver) {
        this.processingCompleteResolver();
        this.processingCompleteResolver = null;
      }
    }
  }

  // Call this method to get a promise that resolves when the queue is empty
  whenEmpty() {
    if (!this.isProcessing && this.queue.length === 0) {
      return Promise.resolve();
    }
    return new Promise(resolve => {
      this.processingCompleteResolver = resolve;
    });
  }
}

function App() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([])
  const [noAlbums, setNoAlbums] = useState(false);
  const [selected, setSelected] = useState(genres[Math.floor(Math.random() * genres.length)]);
  const [albumsCache, setAlbumsCache] = useState([]);
  const [cacheIndex, setCacheIndex] = useState(0);

  useEffect(() => {
    let timeoutId;

    async function fetchToken() {
      const authparameters = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials&client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET
      }
      try {
        const response = await fetch("https://accounts.spotify.com/api/token", authparameters);
        const data = await response.json();
        setAccessToken(data.access_token);
        // Refresh ~1 min before expiry (expires_in is in seconds) so requests never 401.
        const refreshInMs = ((data.expires_in ?? 3600) - 60) * 1000;
        timeoutId = setTimeout(fetchToken, refreshInMs);
      } catch (error) {
        console.error('Failed to fetch Spotify access token:', error);
        timeoutId = setTimeout(fetchToken, 30000); // Retry shortly on failure.
      }
    }

    fetchToken();
    return () => clearTimeout(timeoutId);
  }, [])


  useEffect(() => {
    mixpanel.track('Page View', {
      'Page Name': 'Homepage',
      'Timestamp': new Date().toISOString()
    }); 
  }, []);


  async function fetchLessPopularArtistsFirstAlbums() {
    if (!accessToken) return;

    const limit = 50; // Max number of artists to fetch in one request
    const headers = { Authorization: `Bearer ${accessToken}` };
    const requestDelay = 0; // Delay between requests to prevent 429 errors
    const queue = new RequestQueue(requestDelay);

    try {
      // Collect every artist Spotify surfaces for this genre (search caps at ~100).
      let artistsCollected = [];
      for (let offset = 0; offset < 1000; offset += limit) {
        const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=genre:"${selectedGenre}"&type=artist&limit=${limit}&offset=${offset}&market=${selectedCountry}`, { headers });
        if (searchResponse.status === 429) {
          console.error('Rate limit exceeded');
          break; // If rate limited, exit the loop
        }
        if (!searchResponse.ok) break;

        const searchData = await searchResponse.json();
        const items = searchData.artists?.items ?? [];
        artistsCollected.push(...items);

        if (items.length < limit) break; // No more results to page through
      }

      // Spotify's genre search now returns only the most popular artists, so
      // "less popular" is relative: keep the least popular ones from the result set.
      artistsCollected.sort((a, b) => (a.popularity ?? 0) - (b.popularity ?? 0));
      artistsCollected = artistsCollected.slice(0, 24);

      let firstAlbums = [];
      artistsCollected.forEach(artist => {
        queue.enqueue(async () => {
          const albumsResponse = await fetch(`https://api.spotify.com/v1/artists/${artist.id}/albums?market=${selectedCountry}&limit=1&include_groups=album`, { headers });
          if (!albumsResponse.ok) {
            if (albumsResponse.status === 429) console.error('Rate limit exceeded');
            return;
          }
          const albumsData = await albumsResponse.json();
          if ((albumsData.items?.length ?? 0) > 0) {
            firstAlbums.push(albumsData.items[0]);
          }
        });
      });

      await queue.whenEmpty();

      // Fallback: Spotify's genre artist-search returns only ghost artists (no
      // album releases) for many genres, e.g. gospel/lounge. When the artist
      // path yields nothing, fall back to a free-text album search by genre name
      // — the same mechanism the search bar uses — so the user always gets results.
      if (firstAlbums.length === 0) {
        const fallbackResponse = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(selectedGenre)}&type=album&limit=50&market=${selectedCountry}`, { headers });
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          firstAlbums = fallbackData.albums?.items ?? [];
        }
      }

      firstAlbums.sort((a, b) => {
        return new Date(b.release_date) - new Date(a.release_date);
      });

      setAlbums(firstAlbums);
      setAlbumsCache(artistsCollected);

      if (firstAlbums.length === 0) {
        setNoAlbums(true);
        setAlbumsCache([]);
      }

      setCacheIndex(0);
    } catch (error) {
      console.error('Error fetching albums for genre:', error);
      setAlbums([]);
      setNoAlbums(true); // Surface the failure instead of spinning forever.
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
  
    let artistAlbums = []; // Array to hold artist's albums
    let otherAlbums = []; // Array to hold other albums
  
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
        
        // Store artist's albums separately
        artistAlbums = albumsData.items;
      }
    } catch (error) {
      console.error("Error fetching artist albums:", error);
    }
  
    // Directly search for albums matching the search input
    const albumSearchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchInput)}&type=album&limit=50&market=${selectedCountry}`;
  
    try {
      const searchResponse = await fetch(albumSearchUrl, parameters);
      const searchData = await searchResponse.json();
      // Store all matched albums, including possible duplicates from artist's albums
      otherAlbums = searchData.albums.items;
    } catch (error) {
      console.error("Error fetching albums directly:", error);
    }
  
    // Remove duplicates from otherAlbums that are already in artistAlbums based on album ID
    const artistAlbumsIDs = new Set(artistAlbums.map(album => album.id));
    otherAlbums = otherAlbums.filter(album => !artistAlbumsIDs.has(album.id));
  
    // Sort both arrays from newest to oldest
    artistAlbums.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    otherAlbums.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
  
    // Combine the arrays, prioritizing artistAlbums
    const combinedAndUniqueAlbums = [...artistAlbums, ...otherAlbums];
  
    // Update your state or UI with the combined, unique, and sorted albums
    // setAlbums(combinedAndUniqueAlbums.slice(0, combinedAndUniqueAlbums.length > 24 ? 24 : combinedAndUniqueAlbums.length));
    setAlbums(combinedAndUniqueAlbums);
    setAlbumsCache(combinedAndUniqueAlbums);
  
    if (combinedAndUniqueAlbums.length === 0) {
      setNoAlbums(true);
      setAlbumsCache([]);
    }

    setCacheIndex(0);

    mixpanel.track('Search', {
      'Search Query': searchInput,
      'Timestamp': new Date().toISOString()
    });
  }

  const handleRandomGenre = async () => {
    if (!accessToken) return;

    // Most of Spotify's micro-genres no longer return any artists, so probe
    // random genres until one resolves before committing to it.
    setAlbums([]);
    setNoAlbums(false);

    const headers = { Authorization: `Bearer ${accessToken}` };
    for (let attempt = 0; attempt < 12; attempt++) {
      const candidate = genres[Math.floor(Math.random() * genres.length)];
      try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=genre:"${candidate.name.toLowerCase()}"&type=artist&limit=1&market=${selectedCountry}`, { headers });
        if (!response.ok) continue;
        const data = await response.json();
        if ((data.artists?.total ?? 0) > 0) {
          if (candidate.name.toLowerCase() === selectedGenre) {
            // Same genre as the current one: the effects won't refire, so fetch directly.
            fetchLessPopularArtistsFirstAlbums();
          } else {
            setSelected(candidate); // Flows through the combobox/effect into a fetch.
          }
          return;
        }
      } catch (error) {
        console.error('Surprise Me probe failed:', error);
      }
    }

    // Nothing resolved within the attempt budget.
    setNoAlbums(true);
  }

  // Call the new function after the access token is set
  useEffect(() => {
    if (accessToken && selectedGenre !== '') {
      setAlbums([]);
      setNoAlbums(false);
      fetchLessPopularArtistsFirstAlbums();
      mixpanel.track('Genre Selected', {
        'Genre': selectedGenre,
        'Timestamp': new Date().toISOString()
      });
    }

  }, [accessToken, selectedGenre, selectedCountry]);

  // style={{ background: 'linear-gradient(to right, #1DB954CC, #17E9E0CC)'}}

  return (
    <div className="w-full min-h-screen bg-spotify-dark overflow-x-hidden" >
      <Analytics/>
      <div className={`h-full ${isSidebarOpen ? "w-64" : "w-20"} bg-spotify-dark-gray duration-300 p-4 flex flex-col justify-between fixed opacity-100 z-40`}>
        <div>
          <div className="cursor-pointer flex justify-center" onClick={() => setIsSidebarOpen(!isSidebarOpen)} >
            <div className="flex items-center h-16 w-full justify-center">
              <TbPlayerTrackNextFilled className={`w-10 h-10 text-spotify-green duration-300 hover:scale-110 hover:text-spotify-teal ${isSidebarOpen ? "rotate-180" : ""}`}/>
            </div>
          </div>

          <div className="mt-4 mb-6">
            <p className={`text-spotify-light font-bold text-sm mb-1 duration-200 ${isSidebarOpen ? "opacity-100" : "ml-[-64px] opacity-0"}`}>GENRES</p>
            <GenreCombobox selected={selected} setSelected={setSelected} setSelectedGenre={setSelectedGenre}/>
          </div>

          <div className="mb-6">
            <p className={`text-spotify-light font-bold text-sm mb-1 duration-200 ${isSidebarOpen ? "opacity-100" : "ml-[-64px] opacity-0"}`}>MARKET</p>
            <MarketCombobox setSelectedMarket={setSelectedCountry}/>
          </div>

          <div className="mb-6">
            <p className={`text-spotify-light font-bold text-sm mb-1 duration-200 ${isSidebarOpen ? "opacity-100" : "ml-[-64px] opacity-0"}`}>SURPRISE ME!</p>
            <button className="bg-spotify-green rounded-2xl w-full h-9 duration-300 hover:bg-spotify-teal flex justify-center items-center" onClick={handleRandomGenre}>
              <IoSparklesSharp className="text-spotify-dark"/>
            </button>
          </div>

          <div className={`mb-6 h-28 duration-200 ${isSidebarOpen ? "opacity-100" : "ml-[-64px] opacity-0"}`}>
            <p className="text-spotify-light font-bold text-sm mb-1">DESCRIPTION</p>
            <p className="text-spotify-light-gray text-sm mb-1">Find new albums from less popular artists in a specific genre.</p>
            <p className='text-spotify-light-gray text-sm'>Don't know what to listen to? Let us surprise you!</p>
          </div>

          {/* <div className={`mb-6 h-28 duration-200 ${isSidebarOpen ? "opacity-100" : "ml-[-64px] opacity-0"}`}>
            <p className="text-spotify-light font-bold text-sm mb-1">PAGE</p>
            <button className="bg-spotify-green rounded-2xl w-full h-9 duration-300 hover:bg-spotify-teal flex justify-center items-center">
              right
            </button>
            <button className="bg-spotify-green rounded-2xl w-full h-9 duration-300 hover:bg-spotify-teal flex justify-center items-center">
              left
            </button>
          </div> */}

        </div>
        <div className="flex items-center">
          <a href="https://www.spotify.com/" target="_blank" rel="noopener noreferrer" className="z-50 absolute w-12 h-12">
            <FaSpotify className="w-12 h-12 text-spotify-green hover:scale-110 hover:text-spotify-teal duration-300"/>
          </a>
          <div className={`duration-300  z-0 ${isSidebarOpen ? "ml-[64px] opacity-100" : "ml-[0px] opacity-0"}`}>
            <a href="https://www.spotify.com/" target="_blank" rel="noopener noreferrer">
              <p className="text-[1.75rem] duration-300 hover:scale-110" style={{ background: 'linear-gradient(to right, #1DB954, #17E9E0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                <span className="font-bold tracking-tighter">Spotify</span>
                <span className="font-light">Indie</span>
              </p>
            </a>
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
                placeholder="Find something new!"
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
              <div className="absolute flex items-center justify-center w-full h-32">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 overflow-auto z-10">
                {albums.map((album, index) => {
                  return (
                    // Grid item
                    <div key={index} className="bg-spotify-dark-gray rounded-xl overflow-hidden shadow-lg">
                      <div className="w-full relative">

                        <div className="absolute inset-0 flex justify-center items-center bg-spotify-dark-gray-transparent opacity-0 hover:opacity-100 duration-300">
                          <a href={album?.external_urls?.spotify} target="_blank" rel="noopener noreferrer">
                            <div className="rounded-full h-14 w-14 sm:h-24 sm:w-24 bg-spotify-green hover:bg-spotify-teal flex items-center justify-center hover:scale-110 duration-300">
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


// add popularity slide
// add cache for albums to get new set of albums