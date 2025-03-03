"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTeams } from "../context/TeamsContext";
import { useMatches } from "../context/MatchesContext";

const CreateMatch = () => {
  const navigate = useNavigate();
  const { teams } = useTeams();
  const { createMatch, getCompatibleMatches } = useMatches();
  const [selectedTeam, setSelectedTeam] = useState("");
  const [compatibleMatches, setCompatibleMatches] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const userTeam = teams.find((team) => team.creator.id === currentUser.id);
    if (userTeam) {
      setSelectedTeam(userTeam.id);
      const matches = getCompatibleMatches(userTeam);
      setCompatibleMatches(matches);
    } else {
      navigate("/teams");
    }
  }, [teams, currentUser, navigate, getCompatibleMatches]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const team = teams.find((t) => t.id === Number(selectedTeam));
    if (team) {
      const newMatch = {
        id: Date.now(),
        team: team,
        opponentTeam: null,
        date: team.playDate,
        time: team.playTime,
        stadium: team.stadium,
        playerCount: team.playerCount,
        city: team.city,
        creator: {
          id: currentUser.id,
          name: currentUser.name,
          profileImage: currentUser.profileImage,
        },
        isReady: false,
      };
      createMatch(newMatch);
      navigate("/matches");
    }
  };

  if (compatibleMatches.length > 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Uyğun Matçlar Mövcuddur</h1>
        <p className="mb-4">
          Sizə uyğun matç(lar) var. Zəhmət olmasa, mövcud matçlara qoşulun.
        </p>
        <button
          onClick={() => navigate("/matches")}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Matçlara Bax
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Yeni Matç Yarat</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6"
      >
        <div className="mb-4">
          <label htmlFor="team" className="block text-sm font-medium mb-1">
            Komandanız
          </label>
          <select
            id="team"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full p-2 border rounded"
            required
            disabled
          >
            <option value={selectedTeam}>
              {teams.find((t) => t.id === Number(selectedTeam))?.name}
            </option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Matç Yarat
        </button>
      </form>
    </div>
  );
};

export default CreateMatch;
