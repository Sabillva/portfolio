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

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCity === "" || team.city === filterCity)
  );

  const handleJoinTeam = (teamId) => {
    // Normalda burada istifadəçi məlumatlarını almalıyam
    const newMember = { id: Date.now(), name: "Yeni Üzv" };
    joinTeam(teamId, newMember);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Komandalar</h1>
        <Link
          to="/create-team"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 flex items-center"
        >
          <UserPlus className="mr-2" size={18} />
          Komanda Yarat
        </Link>
      </div>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Komanda axtar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
        <select
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Bütün şəhərlər</option>
          <option value="Bakı">Bakı</option>
          <option value="Sumqayıt">Sumqayıt</option>
          <option value="Gəncə">Gəncə</option>
        </select>
      </div>
      {filteredTeams.length === 0 ? (
        <p className="text-center text-gray-600">Heç bir komanda tapılmadı.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <div key={team.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                {team.logo && (
                  <img
                    src={team.logo || "/placeholder.svg"}
                    alt={`${team.name} logo`}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                )}
                <h2 className="text-xl font-semibold">{team.name}</h2>
              </div>
              <div className="space-y-2">
                <p className="flex items-center text-gray-600">
                  <MapPin className="mr-2" size={18} />
                  {team.city}
                </p>
                <p className="flex items-center text-gray-600">
                  <Pitch className="mr-2" size={18} />
                  {team.stadium}
                </p>
                <p className="flex items-center text-gray-600">
                  <Calendar className="mr-2" size={18} />
                  {team.playDate}
                </p>
                <p className="flex items-center text-gray-600">
                  <Clock className="mr-2" size={18} />
                  {team.playTime}
                </p>
                <p className="flex items-center text-gray-600">
                  <Users className="mr-2" size={18} />
                  {team.currentPlayers} / {team.playerCount} oyunçu
                </p>
              </div>
              <Link
                to={`/team/${team.id}`}
                className="mt-4 block text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
              >
                Ətraflı Bax
              </Link>
              {team.currentPlayers < team.playerCount && (
                <button
                  onClick={() => handleJoinTeam(team.id)}
                  className="mt-2 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
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
