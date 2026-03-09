/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#0A3D62",
                accent: "#1ABC9C",
                background: "#F8F8F8",
                "background-dark": "#0f172a",
                neutral: "#2C3E50",
                clear: "#2ECC71",
                partial: "#F39C12",
                blocked: "#E74C3C",
            },
        },
    },
    plugins: [],
};
