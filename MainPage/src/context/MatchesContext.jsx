"use client";

import { createContext, useState, useContext } from "react";

const MatchesContext = createContext();

export const useMatches = () => useContext(MatchesContext);

export const MatchesProvider = ({ children }) => {
  const [matches, setMatches] = useState([]);

  const createMatch = (match) => {
    setMatches((prevMatches) => [...prevMatches, { ...match, id: Date.now() }]);
  };

  const joinMatch = (matchId, team) => {
    setMatches((prevMatches) =>
      prevMatches.map((match) => {
        if (match.id === matchId && !match.opponentTeam) {
          return { ...match, opponentTeam: team };
        }
        return match;
      })
    );
  };

  return (
    <MatchesContext.Provider value={{ matches, createMatch, joinMatch }}>
      {children}
    </MatchesContext.Provider>
  );
};
