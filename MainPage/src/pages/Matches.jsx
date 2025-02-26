import { Link } from "react-router-dom";
import { useMatches } from "../context/MatchesContext.jsx";
import { useTeams } from "../context/TeamsContext.jsx";
import { MapPin, Calendar, Clock, Users, Swords } from "lucide-react";

const Matches = () => {
  const { matches, joinMatch } = useMatches();
  const { teams } = useTeams();

  const handleJoinMatch = (matchId) => {
    // Bu hissədə normalda istifadəçinin komandasını seçməsi lazımdır
    // Helelik ilk uyğun komandanı seçirəm
    const availableTeam = teams.find(
      (team) =>
        !matches.some(
          (match) =>
            match.team.id === team.id ||
            (match.opponentTeam && match.opponentTeam.id === team.id)
        )
    );

    if (availableTeam) {
      joinMatch(matchId, availableTeam);
    } else {
      alert("Uyğun komanda tapılmadı");
    }
  };

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
      {matches.length === 0 ? (
        <p className="text-center text-gray-600">
          Hələ heç bir matç yaradılmayıb.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
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
              {!match.opponentTeam && (
                <button
                  onClick={() => handleJoinMatch(match.id)}
                  className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
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
