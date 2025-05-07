module.exports = {
  // @see https://tailwindcss.com/docs/upcoming-changes
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      height: {
        'almost-screen': 'calc(-16rem + 100vh)',
        '308px': '19.25rem',
      },
      width: {
        '308px': '19.25rem',
        '600px': '37.5rem',
      },
    },
  },
  variants: {},
  plugins: [
    require( 'tailwindcss' ),
    require( 'precss' ),
    require( 'autoprefixer' )
  ]
}
