/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        wa: {
          green: '#00a884',
          'green-light': '#25d366',
          'green-dark': '#008069',
          'green-outgoing': '#d9fdd3',
          'green-outgoing-dark': '#005c4b',
          'teal-deep': '#128c7e',
          'blue-tick': '#53bdeb',
          'gray-panel': '#f0f2f5',
          'gray-border': '#e9edef',
          'gray-hover': '#f5f6f6',
          'gray-text': '#54656f',
          'gray-subtext': '#667781',
          'dark-bg': '#0c1317',
          'dark-panel': '#111b21',
          'dark-header': '#202c33',
          'dark-hover': '#202c33',
          'dark-border': '#222e35',
          'dark-input': '#2a3942',
          'dark-text': '#e9edef',
          'dark-subtext': '#8696a0',
          'dark-chat-bg': '#0b141a',
        }
      },
      fontFamily: {
        sans: [
          'Segoe UI',
          'Helvetica Neue',
          'Helvetica',
          'Lucida Grande',
          'Arial',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'sans-serif'
        ]
      }
    },
  },
  plugins: [],
}
