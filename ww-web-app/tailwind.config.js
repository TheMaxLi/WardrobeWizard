/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}', './src/**/*'],
	theme: {
		extend: {
			colors: {
				'white-10': 'rgba(255, 255, 255, 0.1)' // 10% white
			},
			fontFamily: {
				Georgia: ['Georgia', 'sans-serif'],
				DMSans: ['DMSans', 'sans-serif']
			}
		},
		plugins: []
	}
};
