// tailwind.config.js

module.exports = {
   content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        fontFamily: {
          cursive: ['"Comic Sans MS"', 'cursive'], // Replace with your desired cursive font
        },
      },
    },
    plugins: [],
  }