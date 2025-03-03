"use client";
import { useParams, useNavigate } from "react-router-dom";
import { useTeams } from "../context/TeamsContext";

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
  } = useTeams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const team = teams.find((t) => t.id === Number(id));

  if (!team) {
    return <div>Komanda tapılmadı</div>;
  }

  const isCreator = team.creator.id === currentUser.id;
  const isMember = team.members.some((member) => member.id === currentUser.id);

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
    updatePlayerCount(team.id, newCount);
  };

  const handleSetReady = () => {
    setTeamReady(team.id, true);
    navigate("/payment-process", { state: { teamId: team.id } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{team.name}</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p>Şəhər: {team.city}</p>
        <p>Stadion: {team.stadium}</p>
        <p>Tarix: {team.playDate}</p>
        <p>Saat: {team.playTime}</p>
        <p>
          Oyunçu sayı: {team.currentPlayers} / {team.playerCount}
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
          team.currentPlayers === team.playerCount && (
            <button
              onClick={handleSetReady}
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
            >
              Komandanı hazır et
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

        {team.isReady && !team.joinMatch && (
          <button
            onClick={() => navigate("/payment-process")}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Ödəniş et
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamDetails;
