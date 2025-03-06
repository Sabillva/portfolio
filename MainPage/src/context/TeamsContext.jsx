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
    const existingTeam = teams.find((t) => t.id === team.id);
    if (!existingTeam) {
      const updatedTeams = [...teams, team];
      setTeams(updatedTeams);
      try {
        localStorage.setItem("teams", JSON.stringify(updatedTeams));
      } catch (error) {
        console.error("Error saving team to localStorage:", error);
        // Handle the error (e.g., remove oldest team, compress data, etc.)
      }
    }
  };

  const updateTeam = (updatedTeam) => {
    const updatedTeams = teams.map((team) =>
      team.id === updatedTeam.id ? updatedTeam : team
    );
    setTeams(updatedTeams);
    try {
      localStorage.setItem("teams", JSON.stringify(updatedTeams));
    } catch (error) {
      console.error("Error updating team in localStorage:", error);
    }
  };

  const removeTeam = (teamId) => {
    const updatedTeams = teams.filter((team) => team.id !== teamId);
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
  };

  const isUserInAnyTeam = (userId) => {
    return teams.some((team) =>
      team.members.some((member) => member.id === userId)
    );
  };

  const joinTeam = (teamId, user) => {
    if (isUserInAnyTeam(user.id)) {
      console.log("İstifadəçi artıq bir komandadadır.");
      return false;
    }

    const updatedTeams = teams.map((team) => {
      if (team.id === teamId && team.members.length < team.playerCount) {
        const isMemberAlready = team.members.some(
          (member) => member.id === user.id
        );
        if (!isMemberAlready) {
          return {
            ...team,
            members: [...team.members, { ...user, isCreator: false }],
            chatMembers: [...team.chatMembers, user],
          };
        }
      }
      return team;
    });
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    return true;
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

  const updateUserInTeams = (updatedUser) => {
    const updatedTeams = teams.map((team) => ({
      ...team,
      members: team.members.map((member) =>
        member.id === updatedUser.id ? { ...member, ...updatedUser } : member
      ),
      creator:
        team.creator.id === updatedUser.id
          ? { ...team.creator, ...updatedUser }
          : team.creator,
    }));
    setTeams(updatedTeams);
    try {
      localStorage.setItem("teams", JSON.stringify(updatedTeams));
    } catch (error) {
      console.error("Error updating user in teams in localStorage:", error);
    }
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
        updateUserInTeams,
        isUserInAnyTeam,
      }}
    >
      {children}
    </TeamsContext.Provider>
  );
};
