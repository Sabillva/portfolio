"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMatches } from "../context/MatchesContext";
import { useTeams } from "../context/TeamsContext";
import {
  Loader,
  Calendar,
  Clock,
  MapPin,
  Users,
  Trash,
  UserPlus,
} from "lucide-react";

const MatchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { matches, cancelMatch, joinMatch } = useMatches();
  const { teams } = useTeams();
  const [match, setMatch] = useState(null);
  const [userTeam, setUserTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (matches && id) {
      const foundMatch = matches.find((m) => m.id === parseInt(id));
      if (foundMatch) {
        setMatch(foundMatch);
      } else {
        setError("Matç tapılmadı");
      }
    }

    // Find user's team where they are the creator
    const team = teams.find(
      (t) => t.creator && t.creator.id === currentUser.id
    );
    setUserTeam(team);

    setLoading(false);
  }, [id, matches, teams, currentUser, navigate]);

  const handleDeleteMatch = async () => {
    if (!match) return;

    setIsDeleting(true);
    try {
      // Check if current user is the creator of the team that created the match
      if (match.team1 && currentUser) {
        const team = teams.find((t) => t.id === match.team1.id);
        if (!team || !team.creator || team.creator.id !== currentUser.id) {
          setError("Yalnız matçı yaradan istifadəçi onu silə bilər");
          setIsDeleting(false);
          return;
        }
      }

      const success = await cancelMatch(match.id);
      if (success) {
        navigate("/matches");
      } else {
        setError("Matç silinərkən xəta baş verdi");
      }
    } catch (err) {
      console.error("Error deleting match:", err);
      setError(err.message || "Matç silinərkən xəta baş verdi");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleJoinMatch = async () => {
    if (!match || !userTeam) return;

    setIsJoining(true);
    try {
      const success = await joinMatch(match.id, userTeam);
      if (success) {
        // Refresh the match data
        const updatedMatch = matches.find((m) => m.id === parseInt(id));
        setMatch(updatedMatch);
      } else {
        setError("Matça qoşularkən xəta baş verdi");
      }
    } catch (err) {
      console.error("Error joining match:", err);
      setError(err.message || "Matça qoşularkən xəta baş verdi");
    } finally {
      setIsJoining(false);
    }
  };

  // Check if user can join this match
  const canJoinMatch = () => {
    if (!match || !userTeam || match.team2 || match.status !== "pending")
      return false;

    // User must be the creator of their team
    if (!userTeam.creator || userTeam.creator.id !== currentUser.id)
      return false;

    // User's team must not be the team that created the match
    if (match.team1.id === userTeam.id) return false;

    // Teams must be compatible (same player count)
    return match.team1.playerCount === userTeam.playerCount;
  };

  // Check if user can delete this match
  const canDeleteMatch = () => {
    if (!match || !currentUser) return false;

    // Find the team that created this match
    const team = teams.find((t) => t.id === match.team1.id);

    // User must be the creator of the team that created the match
    return team && team.creator && team.creator.id === currentUser.id;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-white">
        <Loader className="w-8 h-8 animate-spin mx-auto" />
        <p className="mt-2">Yüklənir...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-4 max-w-md mx-auto">
          {error}
        </div>
        <button
          onClick={() => navigate("/matches")}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Matçlara Qayıt
        </button>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-white text-lg mb-4">Matç tapılmadı</p>
        <button
          onClick={() => navigate("/matches")}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Matçlara Qayıt
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-[#222] border-2 border-white/20 rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Matç Detalları</h1>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#2a2a2a] rounded-lg p-4">
            <h2 className="text-xl font-bold text-white mb-3">Komanda 1</h2>
            <p className="text-lg text-green-400 font-medium mb-2">
              {match.team1.name}
            </p>
            <p className="text-gray-300">
              <span className="text-gray-400">Oyunçu sayı:</span>{" "}
              {match.team1.playerCount}
            </p>
          </div>

          {match.team2 ? (
            <div className="bg-[#2a2a2a] rounded-lg p-4">
              <h2 className="text-xl font-bold text-white mb-3">Komanda 2</h2>
              <p className="text-lg text-green-400 font-medium mb-2">
                {match.team2.name}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-400">Oyunçu sayı:</span>{" "}
                {match.team2.playerCount}
              </p>
            </div>
          ) : (
            <div className="bg-[#2a2a2a] rounded-lg p-4 border-2 border-dashed border-gray-600 flex items-center justify-center">
              <p className="text-gray-400">Komanda 2 gözlənilir</p>
            </div>
          )}
        </div>

        <div className="bg-[#2a2a2a] rounded-lg p-4 mb-6">
          <h2 className="text-xl font-bold text-white mb-3">
            Matç Məlumatları
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-400" />
                <span>{match.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-green-400" />
                <span>{match.time}</span>
              </div>
            </div>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-400" />
                <span>{match.stadiumName}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-400" />
                <span>{match.team1.playerCount} nəfərlik</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => navigate("/matches")}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full"
          >
            Matçlara Qayıt
          </button>

          {canJoinMatch() && (
            <button
              onClick={handleJoinMatch}
              disabled={isJoining}
              className={`bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-full flex items-center ${
                isJoining ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <UserPlus className="mr-2" size={18} />
              {isJoining ? "Qoşulur..." : "Matça Qoşul"}
            </button>
          )}

          {canDeleteMatch() && (
            <button
              onClick={handleDeleteMatch}
              disabled={isDeleting}
              className={`bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-full flex items-center ${
                isDeleting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Trash className="mr-2" size={18} />
              {isDeleting ? "Silinir..." : "Matçı Sil"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDetail;
