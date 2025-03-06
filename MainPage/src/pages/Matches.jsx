"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMatches } from "../context/MatchesContext";
import { useTeams } from "../context/TeamsContext";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Swords,
  Search,
  Filter,
  X,
} from "lucide-react";

const Matches = () => {
  const navigate = useNavigate();
  const { matches, joinMatch, removeMatch, getCompatibleMatches } =
    useMatches();
  const { teams } = useTeams();
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    date: "",
    time: "",
    playerCount: "",
    stadium: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("all"); // all, compatible, myTeam

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userTeam = teams.find((team) => team.creator.id === currentUser?.id);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setLoading(false);
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!matches || !userTeam) return;

    let filtered = [...matches];

    // Apply view mode filter
    if (viewMode === "compatible" && userTeam) {
      filtered = getCompatibleMatches(userTeam);
    } else if (viewMode === "myTeam" && userTeam) {
      filtered = matches.filter(
        (m) =>
          m.team.id === userTeam.id ||
          (m.opponentTeam && m.opponentTeam.id === userTeam.id)
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (match) =>
          match.team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (match.opponentTeam &&
            match.opponentTeam.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    // Apply other filters
    filtered = filtered.filter((match) => {
      return (
        (!filters.date || match.date === filters.date) &&
        (!filters.time || match.time === filters.time) &&
        (!filters.playerCount ||
          match.playerCount === Number(filters.playerCount)) &&
        (!filters.stadium ||
          match.stadium.toLowerCase().includes(filters.stadium.toLowerCase()))
      );
    });

    setFilteredMatches(filtered);
  }, [matches, searchTerm, filters, userTeam, viewMode, getCompatibleMatches]);

  const handleJoinMatch = (match) => {
    setError("");
    try {
      if (!userTeam) {
        throw new Error("Siz heç bir komandanın yaradıcısı deyilsiniz");
      }

      if (match.opponentTeam) {
        throw new Error("Bu matç artıq doludur");
      }

      joinMatch(match.id, userTeam);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveMatch = (matchId) => {
    if (window.confirm("Bu matçı silmək istədiyinizə əminsiniz?")) {
      removeMatch(matchId);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      date: "",
      time: "",
      playerCount: "",
      stadium: "",
    });
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-white">
        <p>Yüklənir...</p>
      </div>
    );
  }

  if (!userTeam) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-[#222] border-2 border-white/20 rounded-3xl shadow-lg p-6 max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">Matçlar</h1>
          <p className="text-gray-400 mb-4">
            Bu səhifəni görmək üçün bir komandanın yaradıcısı olmalısınız.
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Matçlar</h1>
        <Link
          to="/create-matches"
          className="bg-gradient-to-br from-green-400 to-green-600 text-gray-900 font-medium py-2 px-6 rounded-full shadow-lg transform transition-all duration-300 flex items-center justify-center hover:bg-gradient-to-bl hover:shadow-2xl hover:scale-101 active:scale-95 active:from-green-600 active:to-green-400"
        >
          <Swords className="mr-2" size={18} />
          Yeni Matç Yarat
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center border-2 border-white/20 rounded-full p-2 max-w-md mx-auto bg-[#222] transition focus-within:border-gray-500 w-full mb-4">
          <Search className="text-gray-400 ml-3" size={18} />
          <input
            type="text"
            placeholder="Komanda adı ilə axtar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent px-4 flex-1 text-white outline-none text-base w-full"
          />
        </div>

        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-white bg-[#222] border-2 border-white/20 rounded-full px-4 py-2 hover:bg-[#333] transition-all duration-300"
          >
            <Filter size={18} className="mr-2" />
            {showFilters ? "Filtrləri Gizlət" : "Filtrləri Göstər"}
          </button>

          {(filters.date ||
            filters.time ||
            filters.playerCount ||
            filters.stadium ||
            searchTerm) && (
            <button
              onClick={clearFilters}
              className="flex items-center text-white bg-red-500/20 border-2 border-red-500/20 rounded-full px-4 py-2 hover:bg-red-500/30 transition-all duration-300"
            >
              <X size={18} className="mr-2" />
              Filtrləri Təmizlə
            </button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-[#222] border-2 border-white/20 rounded-lg p-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Tarix</label>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="w-full p-2 rounded-full bg-[#353535] border-white/20 border-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Saat</label>
              <input
                type="time"
                name="time"
                value={filters.time}
                onChange={handleFilterChange}
                className="w-full p-2 rounded-full bg-[#353535] border-white/20 border-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Oyunçu sayı
              </label>
              <input
                type="number"
                name="playerCount"
                value={filters.playerCount}
                onChange={handleFilterChange}
                placeholder="Oyunçu sayı"
                className="w-full p-2 rounded-full bg-[#353535] border-white/20 border-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Stadion
              </label>
              <input
                type="text"
                name="stadium"
                value={filters.stadium}
                onChange={handleFilterChange}
                placeholder="Stadion adı"
                className="w-full p-2 rounded-full bg-[#353535] border-white/20 border-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-white"
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setViewMode("all")}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              viewMode === "all"
                ? "bg-gradient-to-br from-green-400 to-green-600 text-gray-900"
                : "bg-[#222] text-white border-2 border-white/20"
            }`}
          >
            Bütün Matçlar
          </button>
          <button
            onClick={() => setViewMode("compatible")}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              viewMode === "compatible"
                ? "bg-gradient-to-br from-green-400 to-green-600 text-gray-900"
                : "bg-[#222] text-white border-2 border-white/20"
            }`}
          >
            Uyğun Matçlar
          </button>
          <button
            onClick={() => setViewMode("myTeam")}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              viewMode === "myTeam"
                ? "bg-gradient-to-br from-green-400 to-green-600 text-gray-900"
                : "bg-[#222] text-white border-2 border-white/20"
            }`}
          >
            Mənim Matçlarım
          </button>
        </div>
      </div>

      {filteredMatches.length === 0 ? (
        <div className="text-center bg-[#222] border-2 border-white/20 rounded-3xl shadow-lg p-6">
          <p className="text-gray-400">Heç bir matç tapılmadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <div
              key={match.id}
              className="bg-[#222] rounded-3xl border-2 border-white/20 shadow-lg p-6 transition transform hover:scale-105 hover:border-gray-300"
            >
              <h2 className="text-xl font-semibold mb-4 text-white">
                {match.team.name} vs{" "}
                {match.opponentTeam ? match.opponentTeam.name : "TBA"}
              </h2>
              <div className="space-y-2 text-gray-300">
                <p className="flex items-center">
                  <MapPin className="mr-2" size={18} />
                  {match.city}, {match.stadium}
                </p>
                <p className="flex items-center">
                  <Calendar className="mr-2" size={18} />
                  {match.date}
                </p>
                <p className="flex items-center">
                  <Clock className="mr-2" size={18} />
                  {match.time}
                </p>
                <p className="flex items-center">
                  <Users className="mr-2" size={18} />
                  {match.playerCount} oyunçu
                </p>
              </div>

              <div className="mt-4 flex items-center">
                <img
                  src={match.creator.profileImage || "/placeholder.svg"}
                  alt={match.creator.name}
                  className="w-6 h-6 rounded-full mr-2"
                />
                <span className="text-sm text-gray-400">
                  {match.creator.name} tərəfindən yaradılıb
                </span>
              </div>

              {!match.opponentTeam && match.team.id !== userTeam.id && (
                <button
                  onClick={() => handleJoinMatch(match)}
                  className="mt-4 w-full bg-gradient-to-br from-green-400 to-green-600 text-gray-900 py-2 px-6 rounded-full font-medium shadow-lg transition-all duration-300 hover:bg-gradient-to-l hover:scale-105 hover:shadow-2xl active:scale-95 active:from-green-600 active:to-green-400"
                >
                  Matça Qoşul
                </button>
              )}

              {match.isReady &&
                (match.team.creator.id === currentUser.id ||
                  (match.opponentTeam &&
                    match.opponentTeam.creator.id === currentUser.id)) && (
                  <Link
                    to="/payment-process"
                    className="mt-4 block text-center w-full border-2 border-white text-white py-2 px-6 rounded-full bg-[#222] font-medium transition-all duration-300 shadow-lg hover:bg-white hover:text-[#222] hover:border-[#222] hover:scale-105"
                  >
                    Ödənişə Keç
                  </Link>
                )}

              {match.team.creator.id === currentUser.id && (
                <button
                  onClick={() => handleRemoveMatch(match.id)}
                  className="mt-2 w-full bg-red-500 text-white py-2 px-6 rounded-full font-medium shadow-lg transition-all duration-300 hover:bg-red-600 hover:scale-105 hover:shadow-2xl active:scale-95"
                >
                  Matçı Sil
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
