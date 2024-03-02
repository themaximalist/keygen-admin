/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,js}",
        "./views/**/*.{html,ejs}"
    ],
    theme: {
        extend: {
            screens: {
                '3xl': '1700px',
            },
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("@tailwindcss/typography")
    ]
}

