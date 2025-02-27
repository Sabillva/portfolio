"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTeams } from "../context/TeamsContext";
import { useMatches } from "../context/MatchesContext";

const CreateMatch = () => {
  const navigate = useNavigate();
  const { teams } = useTeams();
  const { createMatch } = useMatches();
  const [selectedTeam, setSelectedTeam] = useState("");
  const [availableTeams, setAvailableTeams] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Dropdown genişliyini tənzimləmək üçün ref

  useEffect(() => {
    // Yalnız tam məlumatları olan komandaları göstər
    const fullInfoTeams = teams.filter(
      (team) =>
        team.name &&
        team.city &&
        team.stadium &&
        team.playDate &&
        team.playTime &&
        team.playerCount
    );
    setAvailableTeams(fullInfoTeams);
  }, [teams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const team = availableTeams.find(
      (t) => t.id === Number.parseInt(selectedTeam)
    );
    if (team) {
      const newMatch = {
        team: team,
        opponentTeam: null,
        date: team.playDate,
        time: team.playTime,
        stadium: team.stadium,
        playerCount: team.playerCount,
        city: team.city,
      };
      createMatch(newMatch);
      navigate("/matches");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Yeni Matç Yarat</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-[#333] rounded-3xl shadow-xl p-6"
      >
        <div className="mb-6">
          <label
            htmlFor="team"
            className="block text-sm font-medium text-white mb-1"
          >
            Komandanı Seç
          </label>

          <div
            className="flex items-center border-2 border-white/20 rounded-full p-2 bg-[#222] cursor-pointer transition focus-within:border-gray-500 w-full"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="flex-1 text-white px-2">
              {selectedTeam
                ? availableTeams.find(
                    (team) => team.id === Number.parseInt(selectedTeam)
                  ).name
                : "Komanda Seçin"}
            </span>
          </div>

          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute z-10 max-w-100 bg-[#222] border-2 border-white/20 rounded-lg mt-1"
              style={{
                width: dropdownRef.current
                  ? dropdownRef.current.offsetWidth
                  : "auto",
              }}
            >
              {availableTeams.map((team) => (
                <div
                  key={team.id}
                  onClick={() => {
                    setSelectedTeam(team.id.toString());
                    setIsDropdownOpen(false);
                  }}
                  className="px-4 py-2 text-white hover:bg-green-400 cursor-pointer border-white/20 rounded-lg"
                >
                  {team.name} - {team.city}, {team.stadium}, {team.playDate},{" "}
                  {team.playTime}, {team.playerCount} oyunçu
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-br from-green-400 to-green-600 text-gray-900 py-2 px-6 rounded-full shadow-lg hover:bg-gradient-to-bl hover:shadow-2xl transition duration-300"
        >
          Matç Yarat
        </button>
      </form>
    </div>
  );
};

export default CreateMatch;
