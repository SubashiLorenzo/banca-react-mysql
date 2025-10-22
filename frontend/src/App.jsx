import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Clienti from "./pages/Clienti.jsx";
import Conti from "./pages/Conti.jsx";
import Transazioni from "./pages/Transazioni.jsx";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clienti" element={<Clienti />} />
        <Route path="/conti" element={<Conti />} />
        <Route path="/transazioni" element={<Transazioni />} />
      </Routes>
    </>
  );
}

export default App;
