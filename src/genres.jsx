const genres = [
    {
    "id": 1,
    "name": "Accordion"
    },
    {
    "id": 2,
    "name": "African Percussion"
    },
    {
    "id": 3,
    "name": "Albuquerque Indie"
    },
    {
    "id": 4,
    "name": "Alternative Hardcore"
    },
    {
    "id": 5,
    "name": "Andean"
    },
    {
    "id": 6,
    "name": "Anti-folk"
    },
    {
    "id": 7,
    "name": "Australian Country"
    },
    {
    "id": 8,
    "name": "Austrian Hip Hop"
    },
    {
    "id": 9,
    "name": "Banda"
    },
    {
    "id": 10,
    "name": "Baroque"
    },
    {
    "id": 11,
    "name": "Benga"
    },
    {
    "id": 12,
    "name": "Black Metal"
    },
    {
    "id": 13,
    "name": "Blues"
    },
    {
    "id": 14,
    "name": "Blues-rock"
    },
    {
    "id": 15,
    "name": "Brega"
    },
    {
    "id": 16,
    "name": "British Blues"
    },
    {
    "id": 17,
    "name": "Broadway"
    },
    {
    "id": 18,
    "name": "Brutal Death Metal"
    },
    {
    "id": 19,
    "name": "Brutal Deathcore"
    },
    {
    "id": 20,
    "name": "C-pop"
    },
    {
    "id": 21,
    "name": "Canadian Country"
    },
    {
    "id": 22,
    "name": "Cantautor"
    },
    {
    "id": 23,
    "name": "Carnatic"
    },
    {
    "id": 24,
    "name": "Ccm"
    },
    {
    "id": 25,
    "name": "Children's Christmas"
    },
    {
    "id": 26,
    "name": "Children's Music"
    },
    {
    "id": 27,
    "name": "Christian Christmas"
    },
    {
    "id": 28,
    "name": "Christian Dance"
    },
    {
    "id": 29,
    "name": "Christian Hardcore"
    },
    {
    "id": 30,
    "name": "Christian Metal"
    },
    {
    "id": 31,
    "name": "Christian Music"
    },
    {
    "id": 32,
    "name": "Christian Punk"
    },
    {
    "id": 33,
    "name": "Christian Rock"
    },
    {
    "id": 34,
    "name": "Christmas"
    },
    {
    "id": 35,
    "name": "Classic Rock"
    },
    {
    "id": 36,
    "name": "Classic Soundtrack"
    },
    {
    "id": 37,
    "name": "Classical"
    },
    {
    "id": 38,
    "name": "Classical Christmas"
    },
    {
    "id": 39,
    "name": "Classical Guitar"
    },
    {
    "id": 40,
    "name": "Classical Piano"
    },
    {
    "id": 41,
    "name": "Columbus Ohio Indie"
    },
    {
    "id": 42,
    "name": "Contemporary Classical"
    },
    {
    "id": 43,
    "name": "Contemporary Jazz"
    },
    {
    "id": 44,
    "name": "Country"
    },
    {
    "id": 45,
    "name": "Country Blues"
    },
    {
    "id": 46,
    "name": "Country Christmas"
    },
    {
    "id": 47,
    "name": "Country Rock"
    },
    {
    "id": 48,
    "name": "Cryptic Black Metal"
    },
    {
    "id": 49,
    "name": "Dance Pop"
    },
    {
    "id": 50,
    "name": "Dance Rock"
    },
    {
    "id": 51,
    "name": "Dance-punk"
    },
    {
    "id": 52,
    "name": "Dancehall"
    },
    {
    "id": 53,
    "name": "Death Metal"
    },
    {
    "id": 54,
    "name": "Deep Full On"
    },
    {
    "id": 55,
    "name": "Desert Blues"
    },
    {
    "id": 56,
    "name": "Drama"
    },
    {
    "id": 57,
    "name": "Early Music"
    },
    {
    "id": 58,
    "name": "Early Music Ensemble"
    },
    {
    "id": 59,
    "name": "Electro"
    },
    {
    "id": 60,
    "name": "Electro Jazz"
    },
    {
    "id": 61,
    "name": "Electronic"
    },
    {
    "id": 62,
    "name": "Emo"
    },
    {
    "id": 63,
    "name": "Experimental"
    },
    {
    "id": 64,
    "name": "Experimental Rock"
    },
    {
    "id": 65,
    "name": "Fake"
    },
    {
    "id": 66,
    "name": "Faroese Pop"
    },
    {
    "id": 67,
    "name": "Folk"
    },
    {
    "id": 68,
    "name": "Folk Christmas"
    },
    {
    "id": 69,
    "name": "Folk Metal"
    },
    {
    "id": 70,
    "name": "Folk Punk"
    },
    {
    "id": 71,
    "name": "Folk Rock"
    },
    {
    "id": 72,
    "name": "Folk-pop"
    },
    {
    "id": 73,
    "name": "Full On"
    },
    {
    "id": 74,
    "name": "Funk"
    },
    {
    "id": 75,
    "name": "Gamelan"
    },
    {
    "id": 76,
    "name": "German Metal"
    },
    {
    "id": 77,
    "name": "Ghoststep"
    },
    {
    "id": 78,
    "name": "Girl Group"
    },
    {
    "id": 79,
    "name": "Gospel"
    },
    {
    "id": 80,
    "name": "Gothic Metal"
    },
    {
    "id": 81,
    "name": "Greek House"
    },
    {
    "id": 82,
    "name": "Guidance"
    },
    {
    "id": 83,
    "name": "Hard Alternative"
    },
    {
    "id": 84,
    "name": "Hardcore"
    },
    {
    "id": 85,
    "name": "Harp"
    },
    {
    "id": 86,
    "name": "Hawaiian"
    },
    {
    "id": 87,
    "name": "Healing"
    },
    {
    "id": 88,
    "name": "Hindustani Classical"
    },
    {
    "id": 89,
    "name": "Hip Hop"
    },
    {
    "id": 90,
    "name": "Hip Pop"
    },
    {
    "id": 91,
    "name": "Honky Tonk"
    },
    {
    "id": 92,
    "name": "House"
    },
    {
    "id": 93,
    "name": "Hungarian Rock"
    },
    {
    "id": 94,
    "name": "Indian Classical"
    },
    {
    "id": 95,
    "name": "Indie Christmas"
    },
    {
    "id": 96,
    "name": "Indie Folk"
    },
    {
    "id": 97,
    "name": "Indie Pop"
    },
    {
    "id": 98,
    "name": "Indie Pop Rock"
    },
    {
    "id": 99,
    "name": "Indie R&b"
    },
    {
    "id": 100,
    "name": "Indie Rock"
    },
    {
    "id": 101,
    "name": "Indonesian Pop"
    },
    {
    "id": 102,
    "name": "Industrial"
    },
    {
    "id": 103,
    "name": "Italian Jazz"
    },
    {
    "id": 104,
    "name": "J-dance"
    },
    {
    "id": 105,
    "name": "J-indie"
    },
    {
    "id": 106,
    "name": "J-metal"
    },
    {
    "id": 107,
    "name": "J-pop"
    },
    {
    "id": 108,
    "name": "J-punk"
    },
    {
    "id": 109,
    "name": "J-rock"
    },
    {
    "id": 110,
    "name": "Jazz"
    },
    {
    "id": 111,
    "name": "Jazz Blues"
    },
    {
    "id": 112,
    "name": "Jazz Christmas"
    },
    {
    "id": 113,
    "name": "Jazz Fusion"
    },
    {
    "id": 114,
    "name": "Jazz Metal"
    },
    {
    "id": 115,
    "name": "K-hop"
    },
    {
    "id": 116,
    "name": "K-pop"
    },
    {
    "id": 117,
    "name": "La Indie"
    },
    {
    "id": 118,
    "name": "Latin"
    },
    {
    "id": 119,
    "name": "Latin Christian"
    },
    {
    "id": 120,
    "name": "Latin Christmas"
    },
    {
    "id": 121,
    "name": "Latin Jazz"
    },
    {
    "id": 122,
    "name": "Latin Metal"
    },
    {
    "id": 123,
    "name": "Latin Pop"
    },
    {
    "id": 124,
    "name": "Lo-fi"
    },
    {
    "id": 125,
    "name": "Louisville Indie"
    },
    {
    "id": 126,
    "name": "Lounge"
    },
    {
    "id": 127,
    "name": "Marching Band"
    },
    {
    "id": 128,
    "name": "Mbalax"
    },
    {
    "id": 129,
    "name": "Meditation"
    },
    {
    "id": 130,
    "name": "Melodic Death Metal"
    },
    {
    "id": 131,
    "name": "Melodic Progressive Metal"
    },
    {
    "id": 132,
    "name": "Metal"
    },
    {
    "id": 133,
    "name": "Mexican Indie"
    },
    {
    "id": 134,
    "name": "Military Band"
    },
    {
    "id": 135,
    "name": "Modern Classical"
    },
    {
    "id": 136,
    "name": "New Weird America"
    },
    {
    "id": 137,
    "name": "Nintendocore"
    },
    {
    "id": 138,
    "name": "Noise"
    },
    {
    "id": 139,
    "name": "Norteno"
    },
    {
    "id": 140,
    "name": "Opera"
    },
    {
    "id": 141,
    "name": "Orquesta Tipica"
    },
    {
    "id": 142,
    "name": "Poetry"
    },
    {
    "id": 143,
    "name": "Pop"
    },
    {
    "id": 144,
    "name": "Pop Christmas"
    },
    {
    "id": 145,
    "name": "Pop Punk"
    },
    {
    "id": 146,
    "name": "Pop Rock"
    },
    {
    "id": 147,
    "name": "Post-hardcore"
    },
    {
    "id": 148,
    "name": "Post-post-hardcore"
    },
    {
    "id": 149,
    "name": "Post-punk"
    },
    {
    "id": 150,
    "name": "Power Metal"
    },
    {
    "id": 151,
    "name": "Progressive Metal"
    },
    {
    "id": 152,
    "name": "Punk"
    },
    {
    "id": 153,
    "name": "Punk Blues"
    },
    {
    "id": 154,
    "name": "Punk Christmas"
    },
    {
    "id": 155,
    "name": "Quebecois"
    },
    {
    "id": 156,
    "name": "R&b"
    },
    {
    "id": 157,
    "name": "Rap"
    },
    {
    "id": 158,
    "name": "Reggae"
    },
    {
    "id": 159,
    "name": "Reggae Rock"
    },
    {
    "id": 160,
    "name": "Remix"
    },
    {
    "id": 161,
    "name": "Renaissance"
    },
    {
    "id": 162,
    "name": "Rock"
    },
    {
    "id": 163,
    "name": "Romantic"
    },
    {
    "id": 164,
    "name": "Samba"
    },
    {
    "id": 165,
    "name": "Saxophone"
    },
    {
    "id": 166,
    "name": "Screamo"
    },
    {
    "id": 167,
    "name": "Sega"
    },
    {
    "id": 168,
    "name": "Sheffield Indie"
    },
    {
    "id": 169,
    "name": "Shoegaze"
    },
    {
    "id": 170,
    "name": "Ska"
    },
    {
    "id": 171,
    "name": "Skweee"
    },
    {
    "id": 172,
    "name": "Soca"
    },
    {
    "id": 173,
    "name": "Soul"
    },
    {
    "id": 174,
    "name": "Soul Blues"
    },
    {
    "id": 175,
    "name": "Soul Christmas"
    },
    {
    "id": 176,
    "name": "Soul Jazz"
    },
    {
    "id": 177,
    "name": "Soundtrack"
    },
    {
    "id": 178,
    "name": "Stoner Rock"
    },
    {
    "id": 179,
    "name": "Sunset Lounge"
    },
    {
    "id": 180,
    "name": "Swedish Punk"
    },
    {
    "id": 181,
    "name": "Symphonic Metal"
    },
    {
    "id": 182,
    "name": "Talent Show"
    },
    {
    "id": 183,
    "name": "Technical Brutal Death Metal"
    },
    {
    "id": 184,
    "name": "Technical Death Metal"
    },
    {
    "id": 185,
    "name": "Techno"
    },
    {
    "id": 186,
    "name": "Tibetan"
    },
    {
    "id": 187,
    "name": "Tico"
    },
    {
    "id": 188,
    "name": "Traditional Blues"
    },
    {
    "id": 189,
    "name": "Traditional Country"
    },
    {
    "id": 190,
    "name": "Traditional Folk"
    },
    {
    "id": 191,
    "name": "Traditional Reggae"
    },
    {
    "id": 192,
    "name": "Traditional Soul"
    },
    {
    "id": 193,
    "name": "Trance"
    },
    {
    "id": 194,
    "name": "Triangle Indie"
    },
    {
    "id": 195,
    "name": "Tropical"
    },
    {
    "id": 196,
    "name": "Turkish Classical"
    },
    {
    "id": 197,
    "name": "Vegas Indie"
    },
    {
    "id": 198,
    "name": "Video Game Music"
    },
    {
    "id": 199,
    "name": "Vintage Gospel"
    },
    {
    "id": 200,
    "name": "Violin"
    },
    {
    "id": 201,
    "name": "Viral Pop"
    },
    {
    "id": 202,
    "name": "World"
    },
    {
    "id": 203,
    "name": "World Christmas"
    },
    {
    "id": 204,
    "name": "Worship"
    },
    {
    "id": 205,
    "name": "Wrock"
    },
    {
    "id": 206,
    "name": "Zim"
    }
]

export default genres;
