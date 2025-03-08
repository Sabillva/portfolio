"use client";

import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";

const TeamsContext = createContext();

export const useTeams = () => useContext(TeamsContext);

export const TeamsProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const initialLoadDone = useRef(false);

  // Load teams only once at initialization
  useEffect(() => {
    if (initialLoadDone.current) return;

    try {
      const storedTeamsString = localStorage.getItem("teams");
      if (storedTeamsString) {
        const storedTeams = JSON.parse(storedTeamsString);
        setTeams(storedTeams);
      }
    } catch (error) {
      console.error("Error loading teams:", error);
    } finally {
      setIsLoading(false);
      initialLoadDone.current = true;
    }
  }, []);

  // Helper function to safely save teams to localStorage
  const saveTeamsToStorage = useCallback((teamsToSave) => {
    if (!teamsToSave || !Array.isArray(teamsToSave)) return;

    try {
      localStorage.setItem("teams", JSON.stringify(teamsToSave));
      console.log("Teams saved successfully:", teamsToSave);
    } catch (error) {
      console.error("Error saving teams to localStorage:", error);

      if (error.name === "QuotaExceededError") {
        try {
          // Last resort: keep only essential data for the most recent teams
          const minimalTeams = teamsToSave.slice(0, 10).map((team) => ({
            id: team.id,
            name: team.name,
            creator: team.creator
              ? { id: team.creator.id, name: team.creator.name }
              : null,
            members: team.members
              ? team.members.map((m) => ({
                  id: m.id,
                  name: m.name,
                  isCreator: m.isCreator,
                }))
              : [],
          }));

          localStorage.clear(); // Clear everything to make space
          localStorage.setItem("teams", JSON.stringify(minimalTeams));
        } catch (finalError) {
          console.error("Failed to save even minimal team data:", finalError);
        }
      }
    }
  }, []);

  // Check if user is already a team creator
  const isUserTeamCreator = useCallback(
    (userId) => {
      if (!userId) return false;
      return teams.some((team) => team.creator && team.creator.id === userId);
    },
    [teams]
  );

  const addTeam = useCallback(
    (team) => {
      if (!team || !team.id) return false;

      // Check if user is already a team creator
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser && isUserTeamCreator(currentUser.id)) {
        console.error("User is already a team creator");
        return false;
      }

      setTeams((prevTeams) => {
        const existingTeam = prevTeams.find((t) => t.id === team.id);
        if (existingTeam) return prevTeams;

        // Initialize chatMembers if not present
        const newTeam = {
          ...team,
          chatMembers:
            team.chatMembers || (team.members ? [...team.members] : []),
        };

        const updatedTeams = [...prevTeams, newTeam];
        saveTeamsToStorage(updatedTeams);
        return updatedTeams;
      });

      return true;
    },
    [isUserTeamCreator, saveTeamsToStorage]
  );

  const updateTeam = useCallback(
    (updatedTeam) => {
      if (!updatedTeam || !updatedTeam.id) return;

      setTeams((prevTeams) => {
        const updatedTeams = prevTeams.map((team) =>
          team.id === updatedTeam.id ? updatedTeam : team
        );
        saveTeamsToStorage(updatedTeams);
        return updatedTeams;
      });
    },
    [saveTeamsToStorage]
  );

  const removeTeam = useCallback(
    (teamId) => {
      if (!teamId) return;

      setTeams((prevTeams) => {
        const updatedTeams = prevTeams.filter((team) => team.id !== teamId);
        saveTeamsToStorage(updatedTeams);
        return updatedTeams;
      });
    },
    [saveTeamsToStorage]
  );

  const isUserInAnyTeam = useCallback(
    (userId) => {
      if (!userId) return false;

      // Check if user exists in any team's members
      return teams.some(
        (team) =>
          team.members && team.members.some((member) => member.id === userId)
      );
    },
    [teams]
  );

  const joinTeam = useCallback(
    (teamId, user) => {
      if (!teamId || !user || !user.id) return false;

      // Check if user is already in a team
      if (isUserInAnyTeam(user.id)) {
        console.log("İstifadəçi artıq bir komandadadır.");
        return false;
      }

      let success = false;

      setTeams((prevTeams) => {
        const updatedTeams = prevTeams.map((team) => {
          if (
            team.id === teamId &&
            team.members &&
            team.members.length < team.playerCount
          ) {
            const isMemberAlready = team.members.some(
              (member) => member.id === user.id
            );

            if (!isMemberAlready) {
              success = true;
              return {
                ...team,
                members: [...team.members, { ...user, isCreator: false }],
                chatMembers: team.chatMembers
                  ? [...team.chatMembers, user]
                  : [user],
              };
            }
          }
          return team;
        });

        if (success) {
          saveTeamsToStorage(updatedTeams);
        }

        return updatedTeams;
      });

      return success;
    },
    [isUserInAnyTeam, saveTeamsToStorage]
  );

  const leaveTeam = useCallback(
    (teamId, userId) => {
      if (!teamId || !userId) return;

      setTeams((prevTeams) => {
        const updatedTeams = prevTeams.map((team) => {
          if (team.id === teamId) {
            return {
              ...team,
              members: team.members
                ? team.members.filter((member) => member.id !== userId)
                : [],
              chatMembers: team.chatMembers
                ? team.chatMembers.filter((member) => member.id !== userId)
                : [],
            };
          }
          return team;
        });

        saveTeamsToStorage(updatedTeams);
        return updatedTeams;
      });
    },
    [saveTeamsToStorage]
  );

  const removeFromChat = useCallback(
    (teamId, userId) => {
      if (!teamId || !userId) return;

      setTeams((prevTeams) => {
        const updatedTeams = prevTeams.map((team) => {
          if (team.id === teamId && team.chatMembers) {
            return {
              ...team,
              chatMembers: team.chatMembers.filter(
                (member) => member.id !== userId
              ),
            };
          }
          return team;
        });

        saveTeamsToStorage(updatedTeams);
        return updatedTeams;
      });
    },
    [saveTeamsToStorage]
  );

  const updatePlayerCount = useCallback(
    (teamId, newCount) => {
      if (!teamId || typeof newCount !== "number") return;

      setTeams((prevTeams) => {
        const updatedTeams = prevTeams.map((team) => {
          if (team.id === teamId) {
            return { ...team, playerCount: newCount };
          }
          return team;
        });

        saveTeamsToStorage(updatedTeams);
        return updatedTeams;
      });
    },
    [saveTeamsToStorage]
  );

  const setTeamReady = useCallback(
    (teamId, isReady) => {
      if (!teamId) return;

      setTeams((prevTeams) => {
        const updatedTeams = prevTeams.map((team) => {
          if (team.id === teamId) {
            return { ...team, isReady: !!isReady };
          }
          return team;
        });

        saveTeamsToStorage(updatedTeams);
        return updatedTeams;
      });
    },
    [saveTeamsToStorage]
  );

  const updateUserInTeams = useCallback(
    (updatedUser) => {
      if (!updatedUser || !updatedUser.id) return;

      setTeams((prevTeams) => {
        const updatedTeams = prevTeams.map((team) => {
          // Update members
          const updatedMembers = team.members
            ? team.members.map((member) =>
                member.id === updatedUser.id
                  ? { ...member, ...updatedUser }
                  : member
              )
            : [];

          // Update creator
          const updatedCreator =
            team.creator && team.creator.id === updatedUser.id
              ? { ...team.creator, ...updatedUser }
              : team.creator;

          // Update chat members
          const updatedChatMembers = team.chatMembers
            ? team.chatMembers.map((member) =>
                member.id === updatedUser.id
                  ? { ...member, name: updatedUser.name }
                  : member
              )
            : [];

          return {
            ...team,
            members: updatedMembers,
            creator: updatedCreator,
            chatMembers: updatedChatMembers,
          };
        });

        saveTeamsToStorage(updatedTeams);
        return updatedTeams;
      });
    },
    [saveTeamsToStorage]
  );

  // Context value
  const contextValue = {
    teams,
    isLoading,
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
    isUserTeamCreator, // Add this to the context value
  };

  return (
    <TeamsContext.Provider value={contextValue}>
      {children}
    </TeamsContext.Provider>
  );
};
