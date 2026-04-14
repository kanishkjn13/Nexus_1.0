import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App"; // adjust if needed
import "./styles/index.css"; // or your css file
import { ThemeProvider } from "next-themes";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <App />
        </ThemeProvider>
    </React.StrictMode>
);