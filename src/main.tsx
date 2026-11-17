import React from "react";
import ReactDOM from "react-dom/client";

import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import "@kagejs/ui/styles.css";
import "@kagejs/wiki/styles.css";
import "./styles/tailwind.css";
import "./styles/app.css";

import WikiEditor from "./pages/wikiEditor.js";
import WikiRoute from "../packages/wiki/src/components/wikiRoute.js";
import WikiHMR from "../packages/wiki/src/components/wikiHMR.js";
import AutoModPage from "./pages/automod.js";

// 404 Page
function NotFound() {
    return (
        <div>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
        </div>
    );
}

ReactDOM.createRoot(
    document.getElementById("root")!
).render(
    <React.StrictMode>
        <BrowserRouter>
            <WikiHMR />

            <Routes>
                <Route
                    path="/automod"
                    element={<AutoModPage />}
                />

                <Route
                    path="/editor"
                    element={<WikiEditor />}
                />

                <Route
                    path="/404"
                    element={<NotFound />}
                />

                <Route
                    path="*"
                    element={<WikiRoute url="/wiki" />}
                />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
