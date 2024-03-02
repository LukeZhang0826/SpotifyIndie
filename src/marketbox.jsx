import { Fragment, useEffect, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import markets from './markets'

export default function MarketCombobox({setSelectedMarket}) {
  const [selected, setSelected] = useState(markets[172]);
  const [query, setQuery] = useState('')

  const getFilteredMarkets = () => {
    if (query === '') {
      return markets.slice(0, 20);
    } else {
      const lowerCaseQuery = query.toLowerCase().replace(/\s+/g, '');
      const filtered = [];
  
      // First pass: Find markets starting with the query
      for (let i = 0; i < markets.length; i++) {
        const market = markets[i];
        const marketNameNormalized = market.name.toLowerCase().replace(/\s+/g, '');
        if (marketNameNormalized.startsWith(lowerCaseQuery)) {
          filtered.push(market);
          // Break early if 25 matches are found
          if (filtered.length === 20) {
            return filtered;
          }
        }
      }
      return filtered;
    }
  };

  const filteredMarkets = getFilteredMarkets();

  const handleSelected = (market) => {
    setSelected(market);
    setSelectedMarket(market.name);
  }

  useEffect(() => {
    setSelectedMarket(selected.name);
  }, []);

  return (
    <div className="w-full">
      <Combobox value={selected} onChange={handleSelected}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-2xl bg-spotify-dark text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-spotify-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-spotify-green sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-spotify-light bg-spotify-dark focus:ring-0"
              displayValue={(market) => market.name}
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
              {filteredMarkets.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none px-4 py-2 text-spotify-light">
                  Nothing found.
                </div>
              ) : (
                filteredMarkets.map((market) => (
                  <Combobox.Option
                    key={market.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-spotify-green text-spotify-white' : 'text-spotify-light'
                      }`
                    }
                    value={market}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {market.name}
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