"use client";

import { createContext, useState, useContext } from "react";

const TeamsContext = createContext();

export const useTeams = () => useContext(TeamsContext);

export const TeamsProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);

  const addTeam = (team) => {
    setTeams((prevTeams) => [
      ...prevTeams,
      {
        ...team,
        id: Date.now(),
        members: [{ id: 1, name: "Komanda Yaradıcısı" }],
      },
    ]);
  };

  const updateTeam = (id, updatedTeam) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === id ? { ...team, ...updatedTeam } : team
      )
    );
  };

  const deleteTeam = (id) => {
    setTeams((prevTeams) => prevTeams.filter((team) => team.id !== id));
  };

  const joinTeam = (teamId, member) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) => {
        if (team.id === teamId && team.currentPlayers < team.playerCount) {
          return {
            ...team,
            members: [...team.members, member],
            currentPlayers: team.currentPlayers + 1,
          };
        }
        return team;
      })
    );
  };

  return (
    <TeamsContext.Provider
      value={{ teams, addTeam, updateTeam, deleteTeam, joinTeam }}
    >
      {children}
    </TeamsContext.Provider>
  );
};
