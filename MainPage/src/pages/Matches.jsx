"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMatches } from "../context/MatchesContext";
import { useTeams } from "../context/TeamsContext";
import {
  Loader,
  Swords,
  Calendar,
  Clock,
  MapPin,
  Users,
  UserPlus,
} from "lucide-react";

const Matches = () => {
  const navigate = useNavigate();
  const { matches } = useMatches() || { matches: [] }; // Add fallback value
  const { teams } = useTeams();
  const [loading, setLoading] = useState(true);
  const [userTeam, setUserTeam] = useState(null);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [filter, setFilter] = useState("all");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Find user's team
    const team = teams.find(
      (t) =>
        t.members && t.members.some((member) => member.id === currentUser.id)
    );
    setUserTeam(team);

    // Set loading to false
    setLoading(false);
  }, [currentUser, navigate, teams]);

  useEffect(() => {
    if (!matches) {
      setFilteredMatches([]);
      return;
    }

    if (filter === "all") {
      setFilteredMatches(matches);
    } else if (filter === "pending") {
      setFilteredMatches(matches.filter((match) => match.status === "pending"));
    } else if (filter === "confirmed") {
      setFilteredMatches(
        matches.filter((match) => match.status === "confirmed")
      );
    } else if (filter === "myTeam" && userTeam) {
      setFilteredMatches(
        matches.filter(
          (match) =>
            match.team1?.id === userTeam.id || match.team2?.id === userTeam.id
        )
      );
    }
  }, [filter, matches, userTeam]);

  const handleMatchClick = (matchId) => {
    navigate(`/matches/${matchId}`); // Check if this path matches your route in App.jsx
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-white">
        <Loader className="w-8 h-8 animate-spin mx-auto" />
        <p className="mt-2">Yüklənir...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Matçlar</h1>
        <button
          onClick={() => navigate("/create-matches")}
          className="bg-gradient-to-br from-green-400 to-green-600 text-gray-900 py-2 px-4 rounded-full font-medium shadow-lg transition-all duration-300 hover:bg-gradient-to-l hover:scale-105 hover:shadow-2xl flex items-center"
        >
          <Swords className="mr-2" size={18} />
          Matç Yarat
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full ${
            filter === "all"
              ? "bg-green-500 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          Bütün Matçlar
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-full ${
            filter === "pending"
              ? "bg-green-500 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          Gözləyən Matçlar
        </button>
        <button
          onClick={() => setFilter("confirmed")}
          className={`px-4 py-2 rounded-full ${
            filter === "confirmed"
              ? "bg-green-500 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          Təsdiqlənmiş Matçlar
        </button>
        {userTeam && (
          <button
            onClick={() => setFilter("myTeam")}
            className={`px-4 py-2 rounded-full ${
              filter === "myTeam"
                ? "bg-green-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Mənim Matçlarım
          </button>
        )}
      </div>

      {filteredMatches && filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <div
              key={match.id}
              onClick={() => handleMatchClick(match.id)}
              className="bg-[#222] border-2 border-white/20 rounded-xl shadow-lg p-5 cursor-pointer hover:bg-[#2a2a2a] transition-all duration-300 hover:scale-105"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  {match.team1?.name}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    match.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-500"
                      : "bg-green-500/20 text-green-500"
                  }`}
                >
                  {match.status === "pending" ? "Gözləyir" : "Təsdiqlənib"}
                </span>
              </div>

              {match.team2 && (
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-white">
                    VS {match.team2.name}
                  </h4>
                </div>
              )}
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-green-400" />
                  <span>{match.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-green-400" />
                  <span>{match.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-green-400" />
                  <span>{match.stadiumName}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-green-400" />
                  <span>{match.team1?.playerCount} nəfərlik</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // This prevents the parent onClick from firing
                    handleMatchClick(match.id);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-full text-sm"
                >
                  Detallara Bax
                </button>

                {match.status === "pending" &&
                  !match.team2 &&
                  userTeam &&
                  userTeam.creator &&
                  userTeam.creator.id === currentUser.id &&
                  match.team1?.id !== userTeam.id &&
                  match.team1?.playerCount === userTeam.playerCount &&
                  match.stadiumId === userTeam.stadiumId &&
                  match.date === userTeam.playDate &&
                  match.time === userTeam.playTime &&
                  userTeam.joinMatch && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/matches/${match.id}`);
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-full text-sm flex items-center"
                    >
                      <UserPlus className="mr-1" size={14} />
                      Qoşul
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-400 text-lg">Matç tapılmadı</p>
          <button
            onClick={() => navigate("/create-matches")}
            className="mt-4 bg-gradient-to-br from-green-400 to-green-600 text-gray-900 py-2 px-6 rounded-full font-medium shadow-lg transition-all duration-300 hover:bg-gradient-to-l hover:scale-105 hover:shadow-2xl"
          >
            Matç Yarat
          </button>
        </div>
      )}
    </div>
  );
};

export default Matches;
