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

  // Helper function to optimize match data
  const optimizeMatchData = useCallback((match) => {
    if (!match) return null;

    return {
      id: match.id,
      date: match.date,
      time: match.time,
      stadiumId: match.stadiumId,
      stadiumName: match.stadiumName || "",
      status: match.status || "pending",
      team1: match.team1
        ? {
            id: match.team1.id,
            name: match.team1.name,
            playerCount: match.team1.playerCount || 5,
          }
        : null,
      team2: match.team2
        ? {
            id: match.team2.id,
            name: match.team2.name,
            playerCount: match.team2.playerCount || 5,
          }
        : null,
    };
  }, []);

  // Helper function to safely save matches to localStorage
  const saveMatchesToStorage = useCallback(
    (matchesToSave) => {
      try {
        // Optimize match data before saving
        const optimizedMatches = matchesToSave
          .map(optimizeMatchData)
          .filter(Boolean);

        localStorage.setItem("matches", JSON.stringify(optimizedMatches));
      } catch (error) {
        console.error("Error saving matches to localStorage:", error);

        if (error.name === "QuotaExceededError") {
          try {
            // Keep only the most recent 5 matches
            const recentMatches = [...matchesToSave]
              .sort((a, b) => b.id - a.id)
              .slice(0, 5)
              .map(optimizeMatchData)
              .filter(Boolean);

            localStorage.setItem("matches", JSON.stringify(recentMatches));
          } catch (innerError) {
            console.error(
              "Failed to save even minimal match data:",
              innerError
            );
          }
        }
      }
    },
    [optimizeMatchData]
  );

  // Debounced save function
  const debouncedSave = useCallback(
    (matchesToSave) => {
      setTimeout(() => {
        saveMatchesToStorage(matchesToSave);
      }, 300);
    },
    [saveMatchesToStorage]
  );

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

        // Validate inputs
        if (!team || !team.id || !stadiumId || !date || !time) {
          setError("Bütün məlumatları daxil edin");
          return false;
        }

        // Check if team is ready
        if (!team.isReady) {
          setError("Komandanız hazır deyil");
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

        setMatches((prevMatches) => {
          const updatedMatches = [...prevMatches, newMatch];
          debouncedSave(updatedMatches);
          return updatedMatches;
        });

        return true;
      } catch (error) {
        console.error("Error creating match:", error);
        setError("Matç yaradılarkən xəta baş verdi");
        return false;
      }
    },
    [matches, debouncedSave]
  );

  // Join an existing match
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

          debouncedSave(updatedMatches);
          return updatedMatches;
        });

        return true;
      } catch (error) {
        console.error("Error joining match:", error);
        setError("Matça qoşularkən xəta baş verdi");
        return false;
      }
    },
    [matches, areTeamsCompatible, debouncedSave]
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
          debouncedSave(updatedMatches);
          return updatedMatches;
        });

        return true;
      } catch (error) {
        console.error("Error canceling match:", error);
        setError("Matç ləğv edilərkən xəta baş verdi");
        return false;
      }
    },
    [debouncedSave]
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

  // Context value
  const contextValue = {
    matches,
    error,
    createMatch,
    joinMatch,
    cancelMatch,
    getTeamMatches,
    getAvailableMatches,
    clearError: () => setError(null),
  };

  return (
    <MatchesContext.Provider value={contextValue}>
      {children}
    </MatchesContext.Provider>
  );
};
