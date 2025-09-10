import { BrowserRouter, Routes, Route } from "react-router-dom";
import Presences from "./Presences";
import Export from "./Export";
import EditEleve from "./EditEleve";
import { useEffect, useState } from "react";
import './App.css'
import {fetchManifestShortName} from "./utils.ts";

function App() {
    const [manifestShortName, setManifestShortName] = useState("");
    useEffect(() => {
        (async () => {
            setManifestShortName(await fetchManifestShortName());
        })();
    }, []);

    return (
        <>
            <BrowserRouter basename="/presences">
                <Routes>
                    <Route path="/" element={<Presences />} />
                    <Route path="/edit/:eleveId" element={<EditEleve />} />
                    <Route path="/export" element={<Export />} />
                </Routes>
            </BrowserRouter>
            <footer className="small">{manifestShortName}</footer>
        </>
    );
}

export default App
