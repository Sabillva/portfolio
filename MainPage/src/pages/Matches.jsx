import { Link } from "react-router-dom";
import { useMatches } from "../context/MatchesContext";
import { useTeams } from "../context/TeamsContext";
import { MapPin, Calendar, Clock, Users, Swords } from "lucide-react";

const Matches = () => {
  const { matches, joinMatch } = useMatches();
  const { teams } = useTeams();

  const handleJoinMatch = (match) => {
    const availableTeams = teams.filter(
      (team) =>
        team.city === match.city &&
        team.stadium === match.stadium &&
        team.playDate === match.date &&
        team.playTime === match.time &&
        team.playerCount === match.playerCount &&
        team.id !== match.team.id &&
        !matches.some(
          (m) =>
            m.team.id === team.id ||
            (m.opponentTeam && m.opponentTeam.id === team.id)
        )
    );

    if (availableTeams.length > 0) {
      joinMatch(match.id, availableTeams[0]);
    } else {
      alert("Uyğun komanda tapılmadı");
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold text-white">Matçlar</h1>
        <Link
          to="/create-match"
          className="px-6 py-3 bg-gradient-to-br from-green-400 to-green-600 text-black font- rounded-full shadow-lg transform transition-all duration-300 hover:bg-gradient-to-bl hover:shadow-2xl hover:scale-105 active:scale-95 active:from-green-600 active:to-green-400 flex items-center"
        >
          <Swords className="mr-3" size={20} />
          Yeni Matç Yarat
        </Link>
      </div>
      {matches.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          Hələ heç bir matç yaradılmayıb.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-[#222] rounded-3xl border-2 border-white/20 shadow-lg p-6 transition transform hover:scale-101 hover:border-gray-300"
            >
              <h2 className="text-2xl font-semibold mb-4 text-white">
                {match.team.name} vs{" "}
                {match.opponentTeam ? match.opponentTeam.name : "TBA"}
              </h2>
              <div className="space-y-3 text-gray-300">
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

              {!match.opponentTeam && (
                <button
                  onClick={() => handleJoinMatch(match)}
                  className="mt-5 w-full border-2 border-white text-white py-3 px-5 rounded-full bg-[#222] font-medium transition-all duration-300 shadow-lg hover:bg-white hover:text-[#222] hover:border-[#222] hover:scale-105"
                >
                  Matça Qoşul
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
