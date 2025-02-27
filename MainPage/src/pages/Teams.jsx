"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { useTeams } from "../context/TeamsContext";
import {
  Users,
  MapPin,
  Calendar,
  Clock,
  UserPlus,
  PencilIcon as Pitch,
  Search,
} from "lucide-react";

const Teams = () => {
  const { teams, joinTeam } = useTeams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCity === "" || team.city === filterCity)
  );

  const handleJoinTeam = (teamId) => {
    const newMember = { id: Date.now(), name: "Yeni Üzv" };
    joinTeam(teamId, newMember);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-white">Komandalar</h1>
        <Link
          to="/create-team"
          className="bg-gradient-to-br from-green-400 to-green-600 text-gray-900 font-medium py-2 px-6 rounded-full shadow-lg transform transition-all duration-300 flex items-center justify-center hover:bg-gradient-to-bl hover:shadow-2xl hover:scale-101 active:scale-95 active:from-green-600 active:to-green-400"
        >
          <UserPlus className="mr-2" size={18} />
          Komanda Yarat
        </Link>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex items-center border-2 border-white/20 rounded-full p-2 max-w-md mx-auto bg-[#222] transition focus-within:border-gray-500 w-full">
          <Search className="text-gray-400 ml-3" size={18} />
          <input
            type="text"
            placeholder="Komanda axtar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent px-4 flex-1 text-white outline-none text-base w-full"
          />
        </div>

        {/* Custom dropdown for city filter */}
        <div className="relative w-full max-w-md mx-auto">
          <div
            className="flex items-center border-2 border-white/20 rounded-full p-2 bg-[#222] cursor-pointer transition focus-within:border-gray-500 w-full"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Search className="text-gray-400 ml-3" size={18} />
            <span className="flex-1 text-white px-2">
              {filterCity || "Bütün şəhərlər"}
            </span>
          </div>
          {isDropdownOpen && (
            <div className="absolute z-10 bg-[#222] border-2 border-white/20 rounded-lg w-full mt-1">
              <div
                onClick={() => {
                  setFilterCity("Bakı");
                  setIsDropdownOpen(false);
                }}
                className="px-4 py-2 text-white hover:bg-green-400 cursor-pointer border-white/20 rounded-lg"
              >
                Bakı
              </div>
              <div
                onClick={() => {
                  setFilterCity("Sumqayıt");
                  setIsDropdownOpen(false);
                }}
                className="px-4 py-2 text-white hover:bg-green-400 cursor-pointer border-white/20 rounded-lg"
              >
                Sumqayıt
              </div>
              <div
                onClick={() => {
                  setFilterCity("Gəncə");
                  setIsDropdownOpen(false);
                }}
                className="px-4 py-2 text-white hover:bg-green-400 cursor-pointer border-white/20 rounded-lg"
              >
                Gəncə
              </div>
            </div>
          )}
        </div>
      </div>

      {filteredTeams.length === 0 ? (
        <p className="text-center text-gray-400">Heç bir komanda tapılmadı.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <div
              key={team.id}
              className="bg-[#222] rounded-3xl border-2 border-white/20 shadow-lg p-6 transition transform hover:scale-105 hover:border-gray-300"
            >
              <div className="flex items-center mb-4">
                {team.logo && (
                  <img
                    src={team.logo || "/placeholder.svg"}
                    alt={`${team.name} logo`}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                )}
                <h2 className="text-xl font-semibold text-white">
                  {team.name}
                </h2>
              </div>

              <div className="space-y-2 text-gray-300">
                <p className="flex items-center">
                  <MapPin className="mr-2" size={18} />
                  {team.city}
                </p>
                <p className="flex items-center">
                  <Pitch className="mr-2" size={18} />
                  {team.stadium}
                </p>
                <p className="flex items-center">
                  <Calendar className="mr-2" size={18} />
                  {team.playDate}
                </p>
                <p className="flex items-center">
                  <Clock className="mr-2" size={18} />
                  {team.playTime}
                </p>
                <p className="flex items-center">
                  <Users className="mr-2" size={18} />
                  {team.currentPlayers} / {team.playerCount} oyunçu
                </p>
              </div>

              <Link
                to={`/team/${team.id}`}
                className="mt-4 block text-center border-2 border-white text-white py-2 px-6 rounded-full bg-[#222] font-medium transition-all duration-300 shadow-lg hover:bg-white hover:text-[#222] hover:border-[#222] hover:scale-105"
              >
                Ətraflı Bax
              </Link>

              {team.currentPlayers < team.playerCount && (
                <button
                  onClick={() => handleJoinTeam(team.id)}
                  className="mt-2 w-full bg-gradient-to-br from-green-400 to-green-600 text-gray-900 py-2 px-6 rounded-full font-medium shadow-lg transition-all duration-300 hover:bg-gradient-to-l hover:scale-105 hover:shadow-2xl active:scale-95 active:from-green-600 active:to-green-400"
                >
                  Komandaya Qoşul
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;
