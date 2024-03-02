import { Fragment, useEffect, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import genres from './genres'

export default function GenreCombobox({selected, setSelected, setSelectedGenre}) {
  const [query, setQuery] = useState('')

  const getFilteredGenres = () => {
    if (query === '') {
      return genres.slice(0, 20);
    } else {
      const lowerCaseQuery = query.toLowerCase().replace(/\s+/g, '');
      const filtered = [];
      let includesFiltered = [];
  
      // First pass: Find genres starting with the query
      for (let i = 0; i < genres.length; i++) {
        const genre = genres[i];
        const genreNameNormalized = genre.name.toLowerCase().replace(/\s+/g, '');
        if (genreNameNormalized.startsWith(lowerCaseQuery)) {
          filtered.push(genre);
          // Break early if 25 matches are found
          if (filtered.length === 20) {
            return filtered;
          }
        }
      }
  
      // Only proceed if fewer than 25 genres have been found
      if (filtered.length < 20) {
        // Second pass: Find genres including the query, if not already added
        for (let i = 0; i < genres.length && filtered.length + includesFiltered.length < 20; i++) {
          const genre = genres[i];
          const genreNameNormalized = genre.name.toLowerCase().replace(/\s+/g, '');
          if (!genreNameNormalized.startsWith(lowerCaseQuery) && genreNameNormalized.includes(lowerCaseQuery)) {
            includesFiltered.push(genre);
          }
        }
      }
  
      // Combine lists, ensuring the total count doesn't exceed 25
      return filtered.concat(includesFiltered.slice(0, 25 - filtered.length));
    }
  };

  const filteredGenres = getFilteredGenres();

  const handleSelected = (genre) => {
    setSelected(genre);
    setSelectedGenre(genre.name.toLowerCase());
  }

  useEffect(() => {
    setSelectedGenre(selected.name.toLowerCase());
  }, [selected]);

  return (
    <div className="w-full">
      <Combobox value={selected} onChange={handleSelected}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-2xl bg-spotify-dark text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-spotify-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-spotify-green sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-spotify-light bg-spotify-dark focus:ring-0"
              displayValue={(genre) => genre.name}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-spotify-light-gray"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="z-50 absolute mt-1 max-h-60 w-56 overflow-auto rounded-2xl bg-spotify-dark py-1 text-base shadow-lg ring-1 ring-spotify-dark-gray-transparent focus:outline-none sm:text-sm combobox-options">
              {filteredGenres.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none px-4 py-2 text-spotify-light">
                  Nothing found.
                </div>
              ) : (
                filteredGenres.map((genre) => (
                  <Combobox.Option
                    key={genre.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-spotify-green text-spotify-white' : 'text-spotify-light'
                      }`
                    }
                    value={genre}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {genre.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-spotify-white' : 'text-spotify-green'
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}