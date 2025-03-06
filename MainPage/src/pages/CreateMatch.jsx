"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTeams } from "../context/TeamsContext";
import { useMatches } from "../context/MatchesContext";
import { Swords, AlertTriangle, Loader } from "lucide-react";


const CreateMatch = () => {
  const navigate = useNavigate();
  const { teams } = useTeams();
  const { createMatch, getCompatibleMatches } = useMatches();
  const [selectedTeam, setSelectedTeam] = useState("");
  const [compatibleMatches, setCompatibleMatches] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // This is the problematic useEffect - let's fix it
  useEffect(() => {
    // First, check if we have a current user
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Find teams where the current user is the creator
    const userTeams = teams.filter(
      (team) => team.creator?.id === currentUser.id
    );

    if (userTeams.length === 0) {
      setError("Siz heç bir komandanın yaradıcısı deyilsiniz");
      setLoading(false);
      return;
    }

    // Set the first team as selected by default
    const defaultTeam = userTeams[0];
    setSelectedTeam(defaultTeam.id.toString());

    // We'll check for compatible matches in a separate effect
    setLoading(false);
  }, [currentUser, navigate, teams]); // Only depend on these values

  // Separate effect for checking compatible matches
  useEffect(() => {
    if (!selectedTeam || loading) return;

    try {
      const team = teams.find((t) => t.id === Number(selectedTeam));
      if (team) {
        const matches = getCompatibleMatches(team);
        setCompatibleMatches(matches);
      }
    } catch (err) {
      console.error("Error getting compatible matches:", err);
      setError(err.message || "Xəta baş verdi");
    }
  }, [selectedTeam, teams, getCompatibleMatches, loading]);

  const handleTeamChange = (e) => {
    try {
      const teamId = e.target.value;
      setSelectedTeam(teamId);
    } catch (err) {
      setError(err.message || "Xəta baş verdi");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    try {
      const team = teams.find((t) => t.id === Number(selectedTeam));

      if (!team) {
        throw new Error("Komanda tapılmadı");
      }

      const newMatch = {
        id: Date.now(),
        team: {
          id: team.id,
          name: team.name,
          city: team.city,
          playDate: team.playDate,
          playTime: team.playTime,
          playerCount: team.playerCount,
          stadium: team.stadium,
          stadiumId: team.stadiumId,
          creator: {
            id: team.creator.id,
            name: team.creator.name,
            profileImage: team.creator.profileImage,
          },
        },
        opponentTeam: null,
        date: team.playDate,
        time: team.playTime,
        stadium: team.stadium,
        playerCount: team.playerCount,
        city: team.city,
        stadiumId: team.stadiumId,
        creator: {
          id: currentUser.id,
          name: currentUser.name,
          profileImage: currentUser.profileImage,
        },
        isReady: false,
        createdAt: new Date().toISOString(),
      };

      createMatch(newMatch);
      navigate("/matches");
    } catch (err) {
      setError(err.message || "Xəta baş verdi");
      console.error("Error creating match:", err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-white">
        <Loader className="w-8 h-8 animate-spin mx-auto" />
        <p className="mt-2">Yüklənir...</p>
      </div>
    );
  }

  if (error && error === "Siz heç bir komandanın yaradıcısı deyilsiniz") {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-[#222] border-2 border-white/20 rounded-3xl shadow-lg p-6 max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">Matç Yarat</h1>
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-4">
            {error}
          </div>
          <p className="text-gray-400 mb-4">
            Matç yaratmaq üçün əvvəlcə bir komanda yaratmalısınız.
          </p>
          <button
            onClick={() => navigate("/create-team")}
            className="bg-gradient-to-br from-green-400 to-green-600 text-gray-900 py-2 px-6 rounded-full font-medium shadow-lg transition-all duration-300 hover:bg-gradient-to-l hover:scale-105 hover:shadow-2xl"
          >
            Komanda Yarat
          </button>
        </div>
      </div>
    );
  }

  if (compatibleMatches.length > 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-[#222] border-2 border-white/20 rounded-3xl shadow-lg p-6 max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">
            Uyğun Matçlar Mövcuddur
          </h1>
          <div className="flex items-center bg-yellow-500/10 text-yellow-500 p-4 rounded-lg mb-4">
            <AlertTriangle className="mr-2" />
            <p>
              Sizə uyğun {compatibleMatches.length} matç var. Zəhmət olmasa,
              mövcud matçlara qoşulun.
            </p>
          </div>
          <button
            onClick={() => navigate("/matches")}
            className="w-full bg-gradient-to-br from-green-400 to-green-600 text-gray-900 py-3 px-6 rounded-full font-medium shadow-lg transition-all duration-300 hover:bg-gradient-to-l hover:scale-105 hover:shadow-2xl"
          >
            Matçlara Bax
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Yeni Matç Yarat</h1>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-4 max-w-md mx-auto">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-[#222] text-white border-2 border-white/20 rounded-3xl shadow-lg p-6"
      >
        <div className="mb-4">
          <label htmlFor="team" className="block text-sm font-medium mb-1">
            Komandanız
          </label>
          <select
            id="team"
            value={selectedTeam}
            onChange={handleTeamChange}
            className="w-full p-3 rounded-full bg-[#353535] border-white/20 border-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          >
            {teams
              .filter((team) => team.creator?.id === currentUser?.id)
              .map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name} - {team.stadium}, {team.playDate}, {team.playTime}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Matç Məlumatları</h3>
          <div className="bg-[#353535] rounded-lg p-4 border-2 border-white/20">
            {selectedTeam && (
              <>
                {teams
                  .filter((team) => team.id === Number(selectedTeam))
                  .map((team) => (
                    <div key={team.id} className="space-y-2">
                      <p>
                        <span className="text-gray-400">Stadion:</span>{" "}
                        {team.stadium}
                      </p>
                      <p>
                        <span className="text-gray-400">Tarix:</span>{" "}
                        {team.playDate}
                      </p>
                      <p>
                        <span className="text-gray-400">Saat:</span>{" "}
                        {team.playTime}
                      </p>
                      <p>
                        <span className="text-gray-400">Oyunçu sayı:</span>{" "}
                        {team.playerCount}
                      </p>
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-br from-green-400 to-green-600 text-gray-900 py-3 px-6 rounded-full font-medium shadow-lg transition-all duration-300 hover:bg-gradient-to-l hover:scale-105 hover:shadow-2xl flex items-center justify-center"
        >
          <Swords className="mr-2" size={20} />
          Matç Yarat
        </button>
      </form>
    </div>
  );
};

export default CreateMatch;
