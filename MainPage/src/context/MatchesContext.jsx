"use client";

import { createContext, useState, useContext, useEffect } from "react";

const MatchesContext = createContext();

export const useMatches = () => useContext(MatchesContext);

export const MatchesProvider = ({ children }) => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const storedMatches = JSON.parse(localStorage.getItem("matches")) || [];
    setMatches(storedMatches);
  }, []);

  const createMatch = (match) => {
    const updatedMatches = [...matches, match];
    setMatches(updatedMatches);
    localStorage.setItem("matches", JSON.stringify(updatedMatches));
  };

  const joinMatch = (matchId, team) => {
    const updatedMatches = matches.map((match) => {
      if (match.id === matchId && !match.opponentTeam) {
        return { ...match, opponentTeam: team, isReady: true };
      }
      return match;
    });
    setMatches(updatedMatches);
    localStorage.setItem("matches", JSON.stringify(updatedMatches));
  };

  const removeMatch = (matchId) => {
    const updatedMatches = matches.filter((match) => match.id !== matchId);
    setMatches(updatedMatches);
    localStorage.setItem("matches", JSON.stringify(updatedMatches));
  };

  const getMatchesByTeam = (teamId) => {
    return matches.filter(
      (match) =>
        match.team.id === teamId ||
        (match.opponentTeam && match.opponentTeam.id === teamId)
    );
  };

  const getCompatibleMatches = (team) => {
    return matches.filter(
      (match) =>
        match.team.city === team.city &&
        match.team.playDate === team.playDate &&
        match.team.playTime === team.playTime &&
        match.team.playerCount === team.playerCount &&
        match.team.stadiumId === team.stadiumId &&
        !match.opponentTeam
    );
  };

  return (
    <MatchesContext.Provider
      value={{
        matches,
        createMatch,
        joinMatch,
        getMatchesByTeam,
        getCompatibleMatches,
        removeMatch,
      }}
    >
      {children}
    </MatchesContext.Provider>
  );
};
