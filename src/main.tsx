import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"

import "../packages/ui/src/styles/tailwind.css";
import "./styles/app.css";

import "./main.js";

import Home from "./pages/Home.js"
import Playground from "./pages/Playground.js";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/playground" element={<Playground />} />

                    {/* Add a 404 later on */}
                    <Route path="*" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>
)
