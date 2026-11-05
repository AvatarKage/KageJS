import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"

import "../packages/ui/src/styles/tailwind.css";
import "./styles/app.css";

import "./main.js";

import Home from "./pages/Home.js"

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>
)
