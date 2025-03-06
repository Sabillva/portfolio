import { useReservation } from "../context/ReservationContext";
import { useTeams } from "../context/TeamsContext";
import { useMatches } from "../context/MatchesContext";

export const useCheckReservations = () => {
  const reservationContext = useReservation();
  const teamsContext = useTeams();
  const matchesContext = useMatches();

  if (!reservationContext || !teamsContext || !matchesContext) {
    return () => {}; // Return a no-op function if contexts are not available
  }

  const { reservations, removeReservation } = reservationContext;
  const { teams, removeTeam } = teamsContext;
  const { matches, removeMatch } = matchesContext;

  return () => {
    const now = new Date();
    reservations.forEach((reservation) => {
      if (new Date(reservation.expiresAt) < now && !reservation.paid) {
        removeReservation(reservation.id);

        // Check if this reservation was for a team
        const team = teams.find((t) => t.reservationId === reservation.id);
        if (team) {
          removeTeam(team.id);
        }

        // Check if this reservation was for a match
        const match = matches.find((m) => m.reservationId === reservation.id);
        if (match) {
          removeMatch(match.id);
        }
      }
    });
  };
};
