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

// Use IndexedDB as a fallback storage when localStorage is full
const useIndexedDB = () => {
  const dbRef = useRef(null);

  const initDB = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (dbRef.current) {
        resolve(dbRef.current);
        return;
      }

      const request = indexedDB.open("FootballAppDB", 1);

      request.onerror = (event) => {
        console.error("IndexedDB error:", event.target.error);
        reject(event.target.error);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("teams")) {
          db.createObjectStore("teams", { keyPath: "id" });
        }
      };

      request.onsuccess = (event) => {
        dbRef.current = event.target.result;
        resolve(dbRef.current);
      };
    });
  }, []);

  const saveTeams = useCallback(
    async (teams) => {
      try {
        const db = await initDB();
        const transaction = db.transaction(["teams"], "readwrite");
        const store = transaction.objectStore("teams");

        // Clear existing data
        store.clear();

        // Add each team individually
        teams.forEach((team) => {
          store.add(team);
        });

        return new Promise((resolve, reject) => {
          transaction.oncomplete = () => resolve(true);
          transaction.onerror = (event) => reject(event.target.error);
        });
      } catch (error) {
        console.error("Error saving to IndexedDB:", error);
        return false;
      }
    },
    [initDB]
  );

  const getTeams = useCallback(async () => {
    try {
      const db = await initDB();
      const transaction = db.transaction(["teams"], "readonly");
      const store = transaction.objectStore("teams");
      const request = store.getAll();

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
      });
    } catch (error) {
      console.error("Error getting teams from IndexedDB:", error);
      return [];
    }
  }, [initDB]);

  return { saveTeams, getTeams };
};

export const TeamsProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { saveTeams: saveToIndexedDB, getTeams: getFromIndexedDB } =
    useIndexedDB();
  const initialLoadDone = useRef(false);

  // Helper function to optimize team data before storage
  const optimizeTeamData = useCallback((team) => {
    if (!team) return null;

    // Create a smaller version of the team object with only essential data
    const optimizedTeam = {
      id: team.id,
      name: team.name,
      city: team.city || "",
      playDate: team.playDate || "",
      playTime: team.playTime || "",
      playerCount: team.playerCount || 5,
      isReady: team.isReady || false,
      stadiumId: team.stadiumId || null,
    };

    // Add minimal creator data
    if (team.creator) {
      optimizedTeam.creator = {
        id: team.creator.id,
        name: team.creator.name,
      };
    } else {
      optimizedTeam.creator = { id: 0, name: "" };
    }

    // Add minimal members data
    if (team.members && Array.isArray(team.members)) {
      optimizedTeam.members = team.members.map((member) => ({
        id: member.id,
        name: member.name,
        isCreator: member.isCreator || false,
      }));
    } else {
      optimizedTeam.members = [];
    }

    return optimizedTeam;
  }, []);

  // Load teams only once at initialization
  useEffect(() => {
    if (initialLoadDone.current) return;

    const loadTeams = async () => {
      setIsLoading(true);
      try {
        // First try localStorage
        const storedTeamsString = localStorage.getItem("teams");
        if (storedTeamsString) {
          const storedTeams = JSON.parse(storedTeamsString);
          setTeams(storedTeams);
        } else {
          // If not in localStorage, try IndexedDB
          const teamsFromDB = await getFromIndexedDB();
          if (teamsFromDB && teamsFromDB.length > 0) {
            setTeams(teamsFromDB);
          }
        }
      } catch (error) {
        console.error("Error loading teams:", error);
      } finally {
        setIsLoading(false);
        initialLoadDone.current = true;
      }
    };

    loadTeams();
  }, [getFromIndexedDB]);

  // Helper function to safely save teams
  const saveTeamsToStorage = useCallback(
    async (teamsToSave) => {
      if (!teamsToSave || !Array.isArray(teamsToSave)) return;

      // Optimize team data before saving
      const optimizedTeams = teamsToSave.map(optimizeTeamData).filter(Boolean);

      try {
        // First try localStorage
        localStorage.setItem("teams", JSON.stringify(optimizedTeams));
      } catch (error) {
        console.error("Error saving to localStorage:", error);

        if (error.name === "QuotaExceededError") {
          try {
            // If localStorage fails, try IndexedDB
            await saveToIndexedDB(optimizedTeams);
          } catch (dbError) {
            console.error("Error saving to IndexedDB:", dbError);

            // Last resort: keep only essential data for the most recent teams
            try {
              const minimalTeams = optimizedTeams
                .sort((a, b) => b.id - a.id)
                .slice(0, 5)
                .map((team) => ({
                  id: team.id,
                  name: team.name,
                  members: team.members
                    ? team.members.map((m) => ({ id: m.id, name: m.name }))
                    : [],
                }));

              localStorage.clear(); // Clear everything to make space
              localStorage.setItem("teams", JSON.stringify(minimalTeams));
            } catch (finalError) {
              console.error(
                "Failed to save even minimal team data:",
                finalError
              );
            }
          }
        }
      }
    },
    [optimizeTeamData, saveToIndexedDB]
  );

  // Debounced save function to prevent too many storage operations
  const debouncedSave = useCallback(
    (teamsToSave) => {
      setTimeout(() => {
        saveTeamsToStorage(teamsToSave);
      }, 300);
    },
    [saveTeamsToStorage]
  );

  const addTeam = useCallback(
    (team) => {
      if (!team || !team.id) return;

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
        debouncedSave(updatedTeams);
        return updatedTeams;
      });
    },
    [debouncedSave]
  );

  const updateTeam = useCallback(
    (updatedTeam) => {
      if (!updatedTeam || !updatedTeam.id) return;

      setTeams((prevTeams) => {
        const updatedTeams = prevTeams.map((team) =>
          team.id === updatedTeam.id ? updatedTeam : team
        );
        debouncedSave(updatedTeams);
        return updatedTeams;
      });
    },
    [debouncedSave]
  );

  const removeTeam = useCallback(
    (teamId) => {
      if (!teamId) return;

      setTeams((prevTeams) => {
        const updatedTeams = prevTeams.filter((team) => team.id !== teamId);
        debouncedSave(updatedTeams);
        return updatedTeams;
      });
    },
    [debouncedSave]
  );

  const isUserInAnyTeam = useCallback(
    (userId) => {
      if (!userId) return false;
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
              // Create minimal user object
              const minimalUser = {
                id: user.id,
                name: user.name,
                isCreator: false,
              };

              return {
                ...team,
                members: [...team.members, minimalUser],
                chatMembers: team.chatMembers
                  ? [...team.chatMembers, minimalUser]
                  : [minimalUser],
              };
            }
          }
          return team;
        });

        if (success) {
          debouncedSave(updatedTeams);
        }

        return updatedTeams;
      });

      return success;
    },
    [isUserInAnyTeam, debouncedSave]
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

        debouncedSave(updatedTeams);
        return updatedTeams;
      });
    },
    [debouncedSave]
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

        debouncedSave(updatedTeams);
        return updatedTeams;
      });
    },
    [debouncedSave]
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

        debouncedSave(updatedTeams);
        return updatedTeams;
      });
    },
    [debouncedSave]
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

        debouncedSave(updatedTeams);
        return updatedTeams;
      });
    },
    [debouncedSave]
  );

  const updateUserInTeams = useCallback(
    (updatedUser) => {
      if (!updatedUser || !updatedUser.id) return;

      // Create minimal user object to update
      const minimalUser = {
        id: updatedUser.id,
        name: updatedUser.name,
      };

      setTeams((prevTeams) => {
        const updatedTeams = prevTeams.map((team) => {
          // Update members
          const updatedMembers = team.members
            ? team.members.map((member) =>
                member.id === minimalUser.id
                  ? { ...member, name: minimalUser.name }
                  : member
              )
            : [];

          // Update creator
          const updatedCreator =
            team.creator && team.creator.id === minimalUser.id
              ? { ...team.creator, name: minimalUser.name }
              : team.creator;

          // Update chat members
          const updatedChatMembers = team.chatMembers
            ? team.chatMembers.map((member) =>
                member.id === minimalUser.id
                  ? { ...member, name: minimalUser.name }
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

        debouncedSave(updatedTeams);
        return updatedTeams;
      });
    },
    [debouncedSave]
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
  };

  return (
    <TeamsContext.Provider value={contextValue}>
      {children}
    </TeamsContext.Provider>
  );
};
