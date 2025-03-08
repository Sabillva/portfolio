"use client";
import { useParams, useNavigate } from "react-router-dom";
import { useTeams } from "../context/TeamsContext";
import { useEffect, useState } from "react";

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    teams,
    updateTeam,
    leaveTeam,
    removeFromChat,
    updatePlayerCount,
    setTeamReady,
    removeTeam,
  } = useTeams();
  const [currentUser, setCurrentUser] = useState(null);
  const [team, setTeam] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);
    const foundTeam = teams.find((t) => t.id === Number(id));
    setTeam(foundTeam);
  }, [id, teams]);

  if (!team) {
    return <div>Komanda tapılmadı</div>;
  }

  const isCreator = team.creator.id === currentUser?.id;
  const isMember = team.members.some((member) => member.id === currentUser?.id);

  const handleLeaveTeam = () => {
    if (isCreator) {
      alert("Komanda yaradıcısı komandadan çıxa bilməz.");
      return;
    }
    leaveTeam(team.id, currentUser.id);
    navigate("/teams");
  };

  const handleRemoveMember = (memberId) => {
    const updatedMembers = team.members.filter(
      (member) => member.id !== memberId
    );
    const updatedTeam = {
      ...team,
      members: updatedMembers,
      currentPlayers: updatedMembers.length,
    };
    updateTeam(updatedTeam);
    removeFromChat(team.id, memberId);
  };

  const handleRemoveFromChat = (memberId) => {
    removeFromChat(team.id, memberId);
  };

  const handleUpdatePlayerCount = (newCount) => {
    const updatedTeam = { ...team, playerCount: newCount };
    updateTeam(updatedTeam);
  };

  const handleSetReady = () => {
    if (team.members.length === team.playerCount) {
      const updatedTeam = { ...team, isReady: true };
      updateTeam(updatedTeam);
      alert("Komanda hazır vəziyyətə gətirildi!");
    } else {
      alert(
        "Komandanı hazır etmək üçün bütün oyunçu yerlərinin dolu olması lazımdır."
      );
    }
  };

  const handleDeleteTeam = () => {
    if (isCreator) {
      if (window.confirm("Bu komandanı silmək istədiyinizə əminsiniz?")) {
        removeTeam(team.id);
        navigate("/teams");
      }
    }
  };

  const handlePayment = () => {
    if (isCreator && team.isReady) {
      navigate("/payment-process", { state: { teamId: team.id } });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{team.name}</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p>Şəhər: {team.city}</p>
        <p>Stadion: {team.stadium || "Məlumat yoxdur"}</p>
        <p>Tarix: {team.playDate}</p>
        <p>Saat: {team.playTime}</p>
        <p>
          Oyunçu sayı: {team.members.length} / {team.playerCount}
        </p>
        <p>Matça qoşulacaq: {team.joinMatch ? "Bəli" : "Xeyr"}</p>
        <p>Hazırdır: {team.isReady ? "Bəli" : "Xeyr"}</p>

        <h2 className="text-xl font-semibold mt-4 mb-2">Komanda üzvləri:</h2>
        <ul>
          {team.members.map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between mb-2"
            >
              <div className="flex items-center">
                <img
                  src={member.profileImage || "/placeholder.svg"}
                  alt={member.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span>
                  {member.name} {member.isCreator ? "(Yaradıcı)" : ""}
                </span>
              </div>
              {isCreator && !member.isCreator && (
                <div>
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-red-500 mr-2"
                  >
                    Komandadan çıxar
                  </button>
                  <button
                    onClick={() => handleRemoveFromChat(member.id)}
                    className="text-yellow-500"
                  >
                    Çatdan çıxar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>

        {isCreator && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">
              Oyunçu sayını yenilə:
            </label>
            <input
              type="number"
              min="5"
              max="11"
              value={team.playerCount}
              onChange={(e) => handleUpdatePlayerCount(Number(e.target.value))}
              className="border rounded p-1"
            />
          </div>
        )}

        {isCreator &&
          !team.isReady &&
          team.members.length === team.playerCount && (
            <button
              onClick={handleSetReady}
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
            >
              Komandanı Hazır Et
            </button>
          )}

        {isMember && !isCreator && (
          <button
            onClick={handleLeaveTeam}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
          >
            Komandadan ayrıl
          </button>
        )}

        {isCreator && (
          <button
            onClick={handleDeleteTeam}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
          >
            Komandanı Sil
          </button>
        )}

        {isCreator && team.isReady && (
          <button
            onClick={handlePayment}
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
          >
            Ödəniş Et
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamDetails;
