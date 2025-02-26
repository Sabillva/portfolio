"use client";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTeams } from "../context/TeamsContext";
import {
  Users,
  MapPin,
  Calendar,
  Clock,
  PencilIcon as Pitch,
  Trash2,
  Edit,
} from "lucide-react";

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { teams, updateTeam, deleteTeam } = useTeams();
  const team = teams.find((t) => t.id === Number.parseInt(id));

  if (!team) {
    return <div>Komanda tapılmadı</div>;
  }

  const handleEdit = () => {
    // Redaktə səhifəsinə yönləndir
    navigate(`/edit-team/${id}`);
  };

  const handleDelete = () => {
    if (window.confirm("Bu komandanı silmək istədiyinizə əminsiniz?")) {
      deleteTeam(team.id);
      navigate("/teams");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{team.name}</h1>
          <div className="space-x-2">
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        {team.logo && (
          <img
            src={team.logo || "/placeholder.svg"}
            alt={`${team.name} logo`}
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
        </div>
        <h2 className="text-2xl font-semibold mb-4">Komanda Üzvləri</h2>
        <ul className="space-y-2">
          {team.members.map((member) => (
            <li key={member.id} className="flex items-center">
              <Users className="mr-2" size={18} />
              {member.name}
            </li>
          ))}
        </ul>
      </div>
      <Link
        to="/teams"
        className="mt-6 inline-block bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
      >
        Komandalara Qayıt
      </Link>
    </div>
  );
};

export default TeamDetails;
