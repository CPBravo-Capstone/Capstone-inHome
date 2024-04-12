import daisyui from './node_modules/daisyui'

/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // theme: {
  //   extend: {},
  // },
  plugins: [daisyui],
  daisyui: {
      themes:[
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
      "myTheme",
    ],
  },
}



// mytheme: {
//   "primary": "#6ee7b7",     
//   "secondary": "#67e8f9",      
//   "accent": "#38bdf8",    
//   "neutral": "#e5e7eb",     
//   "base-100": "#f3f4f6",
        
//   "info": "#9ca3af",
        
//   "success": "#a3e635",
        
//   "warning": "#fdba74",
        
//   "error": "#f87171",
// },
// },
// ],
// },