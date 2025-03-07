import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { TeamsProvider } from "../context/TeamsContext";
import { MatchesProvider } from "../context/MatchesContext";
import { ChatProvider } from "../context/ChatContext";
import { ReservationProvider } from "../context/ReservationContext";
import SideBar from "../components/SideBar";
import Stadiums from "../pages/Stadiums";
import StadiumDetails from "../pages/StadiumsDetails";
import ReservationProcess from "../pages/ReservationProcess";
import PaymentProcess from "../pages/PaymentProcess";
import PaymentConfirmation from "../pages/PaymentConfirmation";
import Profile from "../pages/Profile";
import Teams from "../pages/Teams";
import CreateTeam from "../pages/CreateTeam";
import TeamDetails from "../pages/TeamDetails";
import Matches from "../pages/Matches";
import CreateMatch from "../pages/CreateMatch";
import Chat from "../pages/Chat";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MatchDetail from "../pages/MatchDetail";

function App() {
  return (
    <Router>
      <TeamsProvider>
        <MatchesProvider>
          <ChatProvider>
            <ReservationProvider>
              <div className="flex">
                <SideBar />
                <div className="flex-1 lg:ml-64 p-4 transition-all duration-300">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/"
                      element={<Navigate to="/stadiums" replace />}
                    />
                    <Route path="/stadiums" element={<Stadiums />} />
                    <Route path="/stadium/:id" element={<StadiumDetails />} />
                    <Route
                      path="/reservation/:id"
                      element={<ReservationProcess />}
                    />
                    <Route
                      path="/payment-process"
                      element={<PaymentProcess />}
                    />
                    <Route
                      path="/payment-confirmation"
                      element={<PaymentConfirmation />}
                    />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/teams" element={<Teams />} />
                    <Route path="/create-team" element={<CreateTeam />} />
                    <Route path="/team/:id" element={<TeamDetails />} />
                    <Route path="/matches" element={<Matches />} />
                    <Route path="/matches/:id" element={<MatchDetail />} />
                    <Route path="/create-matches" element={<CreateMatch />} />
                    <Route path="/chat/:teamId" element={<Chat />} />
                  </Routes>
                </div>
              </div>
            </ReservationProvider>
          </ChatProvider>
        </MatchesProvider>
      </TeamsProvider>
    </Router>
  );
}

export default App;
