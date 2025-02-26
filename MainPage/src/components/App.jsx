import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TeamsProvider } from "../context/TeamsContext.jsx";
import { MatchesProvider } from "../context/MatchesContext.jsx";
import Teams from "../pages/Teams.jsx";
import CreateTeam from "../pages/CreateTeam.jsx";
import "../fonts/Ravio-Regular.ttf";
import SideBar from "./SideBar.jsx";
import Stadiums from "../pages/Stadiums.jsx";
import StadiumDetails from "../pages/StadiumsDetails.jsx";
import ReservationProcess from "../pages/ReservationProcess.jsx";
import PaymentProcess from "../pages/PaymentProcess.jsx";
import PaymentConfirmation from "../pages/PaymentConfirmation.jsx";
import Profile from "../pages/Profile.jsx";
import TeamDetails from "../pages/TeamDetails.jsx";
import Matches from "../pages/Matches.jsx";
import CreateMatch from "../pages/CreateMatch.jsx";

function App() {
  return (
    <TeamsProvider>
      <MatchesProvider>
        <Router>
          <div className="flex">
            <SideBar />
            <div className="flex-1 p-4">
              <Routes>
                <Route path="/stadiums" element={<Stadiums />} />
                <Route path="/stadium/:id" element={<StadiumDetails />} />
                <Route
                  path="/reservation/:id"
                  element={<ReservationProcess />}
                />
                <Route path="/payment-process" element={<PaymentProcess />} />
                <Route
                  path="/payment-confirmation"
                  element={<PaymentConfirmation />}
                />
                <Route path="/profile" element={<Profile />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/create-team" element={<CreateTeam />} />
                <Route path="/team/:id" element={<TeamDetails />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/create-match" element={<CreateMatch />} />
              </Routes>
            </div>
          </div>
        </Router>
      </MatchesProvider>
    </TeamsProvider>
  );
}

export default App;
