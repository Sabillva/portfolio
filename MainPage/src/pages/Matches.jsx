"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMatches } from "../context/MatchesContext";
import { useTeams } from "../context/TeamsContext";
import { MapPin, Calendar, Clock, Users, Swords } from "lucide-react";

const Matches = () => {
  const { matches, joinMatch, removeMatch } = useMatches();
  const { teams } = useTeams();
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    date: "",
    time: "",
    playerCount: "",
    stadium: "",
  });

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userTeam = teams.find((team) => team.creator.id === currentUser.id);

  useEffect(() => {
    if (userTeam) {
      const filtered = matches.filter((match) => {
        const matchTeamName = match.team.name.toLowerCase();
        const searchMatch = matchTeamName.includes(searchTerm.toLowerCase());
        const filterMatch =
          (!filters.date || match.date === filters.date) &&
          (!filters.time || match.time === filters.time) &&
          (!filters.playerCount ||
            match.playerCount === Number(filters.playerCount)) &&
          (!filters.stadium ||
            match.stadium
              .toLowerCase()
              .includes(filters.stadium.toLowerCase()));
        return searchMatch && filterMatch;
      });
      setFilteredMatches(filtered);
    }
  }, [matches, searchTerm, filters, userTeam]);

  const handleJoinMatch = (match) => {
    if (userTeam && !match.opponentTeam) {
      joinMatch(match.id, userTeam);
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

  if (!userTeam) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Matçlar</h1>
        <p className="text-gray-600">
          Bu səhifəni görmək üçün bir komandanın yaradıcısı olmalısınız.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Matçlar</h1>
        <Link
          to="/create-match"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 flex items-center"
        >
          <Swords className="mr-2" size={18} />
          Yeni Matç Yarat
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Komanda adı ilə axtar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <input
            type="time"
            name="time"
            value={filters.time}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="playerCount"
            value={filters.playerCount}
            onChange={handleFilterChange}
            placeholder="Oyunçu sayı"
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="stadium"
            value={filters.stadium}
            onChange={handleFilterChange}
            placeholder="Stadion adı"
            className="p-2 border rounded"
          />
        </div>
      </div>

      <button
        onClick={() =>
          setFilteredMatches(
            matches.filter(
              (m) =>
                m.team.id === userTeam.id ||
                (m.opponentTeam && m.opponentTeam.id === userTeam.id)
            )
          )
        }
        className="mb-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
      >
        Uyğun Matçları Göstər
      </button>

      {filteredMatches.length === 0 ? (
        <p className="text-center text-gray-600">Heç bir matç tapılmadı.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <div key={match.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                {match.team.name} vs{" "}
                {match.opponentTeam ? match.opponentTeam.name : "TBA"}
              </h2>
              <div className="space-y-2">
                <p className="flex items-center text-gray-600">
                  <MapPin className="mr-2" size={18} />
                  {match.city}, {match.stadium}
                </p>
                <p className="flex items-center text-gray-600">
                  <Calendar className="mr-2" size={18} />
                  {match.date}
                </p>
                <p className="flex items-center text-gray-600">
                  <Clock className="mr-2" size={18} />
                  {match.time}
                </p>
                <p className="flex items-center text-gray-600">
                  <Users className="mr-2" size={18} />
                  {match.playerCount} oyunçu
                </p>
              </div>
              {!match.opponentTeam && match.team.id !== userTeam.id && (
                <button
                  onClick={() => handleJoinMatch(match)}
                  className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
                >
                  Matça Qoşul
                </button>
              )}
              {match.isReady && match.team.creator.id === currentUser.id && (
                <Link
                  to="/payment-process"
                  className="mt-4 block text-center w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                >
                  Ödənişə Keç
                </Link>
              )}
              {match.team.creator.id === currentUser.id && (
                <button
                  onClick={() => handleRemoveMatch(match.id)}
                  className="mt-2 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
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
