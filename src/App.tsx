import { BrowserRouter, Routes, Route } from "react-router-dom";
import Presences from "./Presences";
import Export from "./Export";
import EditEleve from "./EditEleve";
import './App.css'

function App() {
  return (
      <BrowserRouter basename="/presences">
          <Routes>
              <Route path="/" element={<Presences />} />
              <Route path="/edit/:eleveId" element={<EditEleve />} />
              <Route path="/export" element={<Export />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App
