# Frontend Coding Challenge - Autocomplete Component

## Description
This project is an implementation of an Autocomplete component based on the specifications provided in the frontend coding challenge. The component is designed to retrieve Pokémon data from the [Pokémon REST API](https://pokeapi.co/docs/v2) and offers a user-friendly interface for searching through Pokémon names.

The goal was to create a reusable Autocomplete component in Angular framework without using external UI libraries. The component is intended to work seamlessly with various APIs and data transfer objects (DTOs).

### Challenge Overview
- **Time Limit**: The challenge is expected to be completed within 4-6 hours.
- **Data Source**: Utilize the Pokémon API to fetch Pokémon data.

### Resources
- Material Icons: [Material Icons](https://fonts.google.com/icons)
- Custom Fonts: [Google Fonts](https://fonts.google.com/)

## Features
- Reusable Autocomplete component
- Instant filtering of Pokémon names based on user input
- Ability to highlight matching list items 
- Infinite scrolling to fetch more Pokémon data when needed
- Display of Pokémon details upon selection

## Installation Instructions
1. Open the project in Stackblitz: [Stackblitz Project Link](https://stackblitz.com/~/github.com/dawsir/stackblitz-starters-ngpfmz).
2. Ensure you have an active internet connection to access the Pokémon API.
3. No additional installations are required as the project is hosted on Stackblitz.

## Usage
1. Click on the Autocomplete input to display the list of Pokémon.
2. Start typing to filter the results based on your input.
3. Click on a Pokémon name to see its details below the input field.
4. Click the “X” button to clear the input and restore the initial Pokémon list.

## Challenge Steps Completed
1. Fetched the first 151 Pokémon from the API: `https://pokeapi.co/api/v2/pokemon?&limit=151`.
2. Implemented local storage of Pokémon data for quick access.
3. Created a filtering mechanism that responds to user input.
4. Optionally highlighted matching items in the results list.
5. Implemented infinite scrolling for fetching additional Pokémon as needed.
6. Added functionality to clear the input and restore the initial list.
7. Displayed Pokémon details upon item selection, including an image sourced from the API.

## Challenges Faced
- Ensuring smooth filtering of results based on user input was crucial, particularly with respect to performance.
- Implementing infinite scrolling required careful management of API calls and state updates.

## Contributing
Feel free to reach out if you have suggestions for improvements or enhancements. Pull requests are welcome!

## License
This project is not licensed; it is solely for the purpose of the coding challenge.

## Acknowledgments
- Thanks to the creators of the Pokémon API for providing a comprehensive dataset.
- Special thanks to the design team for the Figma prototype.
