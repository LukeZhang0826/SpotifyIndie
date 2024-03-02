/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'spotify-green': '#1db954',
        'spotify-dark': '#121212',
        'spotify-dark-gray': '#212121',
        'spotify-dark-gray-transparent': 'rgba(33, 33, 33, 0.5)',
        'spotify-light-gray': '#535353',
        'spotify-light': '#b3b3b3',
        'spotify-white': '#f0f0f0',
      },
      gradientColorStops: {
        'spotify-teal': '#1db954',
        'spotify-green': '#1db954',
      },
    },
  },
  plugins: [],
}