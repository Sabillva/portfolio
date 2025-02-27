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
    return <div className="text-white text-center">Komanda tapılmadı</div>;
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
      <div className=" mx-auto bg-[#333] rounded-3xl shadow-xl p-6 border-2 border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">{team.name}</h1>
          <div className="space-x-2">
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition duration-300"
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
            <p className="flex items-center text-white">
              <MapPin className="mr-2" size={18} />
              {team.city}
            </p>
            <p className="flex items-center text-white">
              <Pitch className="mr-2" size={18} />
              {team.stadium}
            </p>
            <p className="flex items-center text-white">
              <Calendar className="mr-2" size={18} />
              {team.playDate}
            </p>
            <p className="flex items-center text-white">
              <Clock className="mr-2" size={18} />
              {team.playTime}
            </p>
            <p className="flex items-center text-white">
              <Users className="mr-2" size={18} />
              {team.currentPlayers} / {team.playerCount} oyunçu
            </p>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Komanda Üzvləri
        </h2>
        <ul className="space-y-2">
          {team.members.map((member) => (
            <li key={member.id} className="flex items-center text-white">
              <Users className="mr-2" size={18} />
              {member.name}
            </li>
          ))}
        </ul>
      </div>
      <Link
        to="/teams"
        className="mt-6 inline-block bg-gradient-to-br from-green-400 to-green-600 py-2 px-4 rounded-full hover:bg-gradient-to-bl hover:shadow-2xl transition duration-300"
      >
        Komandalara Qayıt
      </Link>
    </div>
  );
};

export default TeamDetails;
