import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../fonts/Ravio-Regular.ttf";
import SideBar from "./SideBar.jsx";
import Stadiums from "../pages/Stadiums.jsx"
import StadiumDetails from "../pages/StadiumsDetails.jsx"

function App() {
  return (
    <Router>
      <div className="flex">
        <SideBar />
        <div className="flex-1 p-4">
          <Routes>
          <Route path="/stadiums" element={<Stadiums />} />
            <Route path="/stadium/:id" element={<StadiumDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
