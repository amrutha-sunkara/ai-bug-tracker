import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { ThemeProvider } from "./context/ThemeContext";

import { Toaster } from "react-hot-toast";

import "./index.css";


ReactDOM.createRoot(
document.getElementById("root")
)
.render(

<React.StrictMode>

<ThemeProvider>

<App />

<Toaster
position="top-right"
/>

</ThemeProvider>

</React.StrictMode>

);