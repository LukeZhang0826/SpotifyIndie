# SpotifyIndie

Find albums from the least popular artists in a Spotify genre, instead of the same
well-known names genre search always surfaces first.

Live: https://spotify-indie.vercel.app

## How it works

Pick a genre and a market and the app pages through Spotify's artist search for that
genre, sorts the results by popularity ascending, keeps the 24 least popular artists,
and fetches each one's first album. Results are sorted newest release first.

Spotify's genre search returns only artists with no releases for a lot of genres, so
when the artist path comes back empty the app falls back to a free-text album search on
the genre name.

Other things it does:

- Free-text search returns the matched artist's own albums first, then other albums
  matching the query, deduplicated by album id
- Surprise Me picks a random genre, probing up to 12 candidates until one actually
  returns artists, since many of Spotify's micro-genres no longer resolve
- 206 genres and 184 markets, both as searchable comboboxes

Per-artist album lookups go through a serial request queue rather than firing in
parallel, which is what keeps the burst of 24 requests under Spotify's rate limit.

## Stack

React 18 and Vite 5, Tailwind for styling, Headless UI for the comboboxes,
react-transition-group for the panel animations. Vercel Analytics and Mixpanel for
usage. Deployed on Vercel, pinned to Node 24.

## Running it

```bash
npm install
npm run dev
```

You need a `.env` in the project root:

```
VITE_SPOTIFY_CLIENT_ID=
VITE_SPOTIFY_CLIENT_SECRET=
VITE_MIXPANEL_TOKEN=
```

Spotify credentials come from an app you create at
https://developer.spotify.com/dashboard.

`npm run build` produces the production bundle, `npm run preview` serves it locally, and
`npm run lint` runs ESLint with warnings treated as errors.
