"use client";

import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useTeams } from "./TeamsContext";

const MatchesContext = createContext();

export const useMatches = () => useContext(MatchesContext);

export const MatchesProvider = ({ children }) => {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const { teams } = useTeams();
  const initialLoadDone = useRef(false);

  // Load matches from localStorage only once at initialization
  useEffect(() => {
    if (initialLoadDone.current) return;

    try {
      const storedMatches = JSON.parse(localStorage.getItem("matches")) || [];
      setMatches(storedMatches);
    } catch (error) {
      console.error("Error loading matches from localStorage:", error);
      setMatches([]);
    }

    initialLoadDone.current = true;
  }, []);

  // Helper function to safely save matches to localStorage
  const saveMatchesToStorage = useCallback((matchesToSave) => {
    try {
      localStorage.setItem("matches", JSON.stringify(matchesToSave));
      console.log("Matches saved successfully:", matchesToSave);
    } catch (error) {
      console.error("Error saving matches to localStorage:", error);

      if (error.name === "QuotaExceededError") {
        try {
          // Keep only the most recent 5 matches
          const recentMatches = [...matchesToSave]
            .sort((a, b) => b.id - a.id)
            .slice(0, 5);

          localStorage.setItem("matches", JSON.stringify(recentMatches));
        } catch (innerError) {
          console.error("Failed to save even minimal match data:", innerError);
        }
      }
    }
  }, []);

  // Check if teams are compatible for a match
  const areTeamsCompatible = useCallback((team1, team2) => {
    if (!team1 || !team2) return false;

    // Teams should have the same player count
    return team1.playerCount === team2.playerCount;
  }, []);

  // Create a new match
  const createMatch = useCallback(
    (team, stadiumId, stadiumName, date, time) => {
      try {
        // Clear any previous errors
        setError(null);

        console.log("Creating match with:", {
          team,
          stadiumId,
          stadiumName,
          date,
          time,
        });

        // Validate inputs
        if (!team || !team.id || !stadiumId || !date || !time) {
          setError("Bütün məlumatları daxil edin");
          console.error("Missing required fields:", {
            team,
            stadiumId,
            date,
            time,
          });
          return false;
        }

        // Check if team is ready
        if (!team.isReady) {
          setError("Komandanız hazır deyil");
          console.error("Team is not ready");
          return false;
        }

        // Check if team has joinMatch flag set to true
        if (!team.joinMatch) {
          setError("Bu komanda matç yaratmaq üçün uyğun deyil");
          console.error("Team does not have joinMatch flag");
          return false;
        }

        // Check if user is the creator of the team
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (
          !currentUser ||
          !team.creator ||
          team.creator.id !== currentUser.id
        ) {
          setError("Yalnız komanda yaradıcısı matç yarada bilər");
          console.error("User is not the team creator");
          return false;
        }

        // Check if team already has a pending match
        const hasExistingMatch = matches.some(
          (match) =>
            (match.team1?.id === team.id || match.team2?.id === team.id) &&
            match.status === "pending"
        );

        if (hasExistingMatch) {
          setError("Komandanızın artıq gözləyən matçı var");
          console.error("Team already has a pending match");
          return false;
        }

        // Create new match
        const newMatch = {
          id: Date.now(),
          date,
          time,
          stadiumId,
          stadiumName,
          status: "pending",
          team1: {
            id: team.id,
            name: team.name,
            playerCount: team.playerCount,
          },
          team2: null,
        };

        console.log("New match created:", newMatch);

        setMatches((prevMatches) => {
          const updatedMatches = [...prevMatches, newMatch];
          saveMatchesToStorage(updatedMatches);
          return updatedMatches;
        });

        return true;
      } catch (error) {
        console.error("Error creating match:", error);
        setError("Matç yaradılarkən xəta baş verdi");
        return false;
      }
    },
    [matches, saveMatchesToStorage]
  );

  // Also update the joinMatch function
  const joinMatch = useCallback(
    (matchId, team) => {
      try {
        // Clear any previous errors
        setError(null);

        // Find the match
        const match = matches.find((m) => m.id === matchId);
        if (!match) {
          setError("Matç tapılmadı");
          return false;
        }

        // Check if match is already full
        if (match.team2) {
          setError("Bu matç artıq doludur");
          return false;
        }

        // Check if team is ready
        if (!team.isReady) {
          setError("Komandanız hazır deyil");
          return false;
        }

        // Check if team has joinMatch flag set to true
        if (!team.joinMatch) {
          setError("Bu komanda matça qoşulmaq üçün uyğun deyil");
          return false;
        }

        // Check if user is the creator of the team
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (
          !currentUser ||
          !team.creator ||
          team.creator.id !== currentUser.id
        ) {
          setError("Yalnız komanda yaradıcısı matça qoşula bilər");
          return false;
        }

        // Check if team already has a pending match
        const hasExistingMatch = matches.some(
          (m) =>
            (m.team1?.id === team.id || m.team2?.id === team.id) &&
            m.status === "pending" &&
            m.id !== matchId
        );

        if (hasExistingMatch) {
          setError("Komandanızın artıq gözləyən matçı var");
          return false;
        }

        // Check if teams are compatible
        if (
          !areTeamsCompatible(match.team1, {
            id: team.id,
            name: team.name,
            playerCount: team.playerCount,
          })
        ) {
          setError("Komandanız bu matç üçün uyğun deyil");
          return false;
        }

        // Update the match
        setMatches((prevMatches) => {
          const updatedMatches = prevMatches.map((m) => {
            if (m.id === matchId) {
              return {
                ...m,
                team2: {
                  id: team.id,
                  name: team.name,
                  playerCount: team.playerCount,
                },
                status: "confirmed",
              };
            }
            return m;
          });

          saveMatchesToStorage(updatedMatches);
          return updatedMatches;
        });

        return true;
      } catch (error) {
        console.error("Error joining match:", error);
        setError("Matça qoşularkən xəta baş verdi");
        return false;
      }
    },
    [matches, areTeamsCompatible, saveMatchesToStorage]
  );

  // Cancel a match
  const cancelMatch = useCallback(
    (matchId) => {
      try {
        setError(null);

        setMatches((prevMatches) => {
          const updatedMatches = prevMatches.filter(
            (match) => match.id !== matchId
          );
          saveMatchesToStorage(updatedMatches);
          return updatedMatches;
        });

        return true;
      } catch (error) {
        console.error("Error canceling match:", error);
        setError("Matç ləğv edilərkən xəta baş verdi");
        return false;
      }
    },
    [saveMatchesToStorage]
  );

  // Get matches for a specific team
  const getTeamMatches = useCallback(
    (teamId) => {
      if (!teamId) return [];

      return matches.filter(
        (match) => match.team1?.id === teamId || match.team2?.id === teamId
      );
    },
    [matches]
  );

  // Get available matches that a team can join
  const getAvailableMatches = useCallback(
    (team) => {
      if (!team || !team.id) return [];

      return matches.filter(
        (match) =>
          match.status === "pending" &&
          !match.team2 &&
          match.team1?.id !== team.id &&
          areTeamsCompatible(match.team1, {
            id: team.id,
            name: team.name,
            playerCount: team.playerCount,
          })
      );
    },
    [matches, areTeamsCompatible]
  );

  // Get available matches that a team can join
  const getCompatibleMatches = useCallback(
    (team) => {
      if (!team || !team.id) return [];

      return matches.filter(
        (match) =>
          match.status === "pending" &&
          !match.team2 &&
          match.team1?.id !== team.id &&
          // Check for compatibility - same stadium, date, time, and player count
          match.stadiumId === team.stadiumId &&
          match.date === team.playDate &&
          match.time === team.playTime &&
          match.team1.playerCount === team.playerCount
      );
    },
    [matches]
  );

  // Context value
  const contextValue = {
    matches,
    error,
    createMatch,
    joinMatch,
    cancelMatch,
    getTeamMatches,
    getAvailableMatches,
    getCompatibleMatches,
    clearError: () => setError(null),
  };

  return (
    <MatchesContext.Provider value={contextValue}>
      {children}
    </MatchesContext.Provider>
  );
};

export default MatchesProvider;
