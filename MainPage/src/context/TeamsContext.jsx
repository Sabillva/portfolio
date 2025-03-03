"use client";

import { createContext, useState, useContext, useEffect } from "react";

const TeamsContext = createContext();

export const useTeams = () => useContext(TeamsContext);

export const TeamsProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const storedTeams = JSON.parse(localStorage.getItem("teams")) || [];
    setTeams(storedTeams);
  }, []);

  const addTeam = (team) => {
    const updatedTeams = [...teams, team];
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
  };

  const updateTeam = (updatedTeam) => {
    const updatedTeams = teams.map((team) =>
      team.id === updatedTeam.id ? updatedTeam : team
    );
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
  };

  const removeTeam = (teamId) => {
    const updatedTeams = teams.filter((team) => team.id !== teamId);
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
  };

  const joinTeam = (teamId, user) => {
    const updatedTeams = teams.map((team) => {
      if (team.id === teamId && team.members.length < team.playerCount) {
        return { ...team, members: [...team.members, user] };
      }
      return team;
    });
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
  };

  const leaveTeam = (teamId, userId) => {
    const updatedTeams = teams.map((team) => {
      if (team.id === teamId) {
        return {
          ...team,
          members: team.members.filter((member) => member.id !== userId),
        };
      }
      return team;
    });
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
  };

  const removeFromChat = (teamId, userId) => {
    const updatedTeams = teams.map((team) => {
      if (team.id === teamId) {
        return {
          ...team,
          chatMembers: team.chatMembers.filter(
            (member) => member.id !== userId
          ),
        };
      }
      return team;
    });
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
  };

  const updatePlayerCount = (teamId, newCount) => {
    const updatedTeams = teams.map((team) => {
      if (team.id === teamId) {
        return { ...team, playerCount: newCount };
      }
      return team;
    });
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
  };

  const setTeamReady = (teamId, isReady) => {
    const updatedTeams = teams.map((team) => {
      if (team.id === teamId) {
        return { ...team, isReady };
      }
      return team;
    });
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
  };

  return (
    <TeamsContext.Provider
      value={{
        teams,
        addTeam,
        updateTeam,
        removeTeam,
        joinTeam,
        leaveTeam,
        removeFromChat,
        updatePlayerCount,
        setTeamReady,
      }}
    >
      {children}
    </TeamsContext.Provider>
  );
};
