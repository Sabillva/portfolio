"use client";

import { createContext, useState, useContext, useEffect } from "react";
import io from "socket.io-client";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [chats, setChats] = useState({});
  const [typing, setTyping] = useState({});

  useEffect(() => {
    const newSocket = io("http://localhost:3001"); // Backend server ünvanınıza uyğun dəyişdirin
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const sendMessage = (teamId, message) => {
    if (socket) {
      socket.emit("sendMessage", { teamId, message });
    }
    setChats((prevChats) => ({
      ...prevChats,
      [teamId]: [...(prevChats[teamId] || []), message],
    }));
  };

  const getTeamChat = (teamId) => {
    return chats[teamId] || [];
  };

  const startTyping = (teamId, userId) => {
    if (socket) {
      socket.emit("typing", { teamId, userId });
    }
  };

  const stopTyping = (teamId, userId) => {
    if (socket) {
      socket.emit("stopTyping", { teamId, userId });
    }
  };

  const editMessage = (teamId, messageId, newText) => {
    if (socket) {
      socket.emit("editMessage", { teamId, messageId, newText });
    }
    setChats((prevChats) => ({
      ...prevChats,
      [teamId]: prevChats[teamId].map((msg) =>
        msg.id === messageId ? { ...msg, text: newText } : msg
      ),
    }));
  };

  const deleteMessage = (teamId, messageId) => {
    if (socket) {
      socket.emit("deleteMessage", { teamId, messageId });
    }
    setChats((prevChats) => ({
      ...prevChats,
      [teamId]: prevChats[teamId].filter((msg) => msg.id !== messageId),
    }));
  };

  const addReaction = (teamId, messageId, userId, reaction) => {
    if (socket) {
      socket.emit("addReaction", { teamId, messageId, userId, reaction });
    }
    setChats((prevChats) => ({
      ...prevChats,
      [teamId]: prevChats[teamId].map((msg) => {
        if (msg.id === messageId) {
          const updatedReactions = { ...msg.reactions };
          if (updatedReactions[reaction]) {
            updatedReactions[reaction]++;
          } else {
            updatedReactions[reaction] = 1;
          }
          return { ...msg, reactions: updatedReactions };
        }
        return msg;
      }),
    }));
  };

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", ({ teamId, message }) => {
        setChats((prevChats) => ({
          ...prevChats,
          [teamId]: [...(prevChats[teamId] || []), message],
        }));
      });

      socket.on("userTyping", ({ teamId, userId }) => {
        setTyping((prev) => ({
          ...prev,
          [teamId]: { ...prev[teamId], [userId]: true },
        }));
      });

      socket.on("userStoppedTyping", ({ teamId, userId }) => {
        setTyping((prev) => ({
          ...prev,
          [teamId]: { ...prev[teamId], [userId]: false },
        }));
      });

      socket.on("messageEdited", ({ teamId, messageId, newText }) => {
        setChats((prevChats) => ({
          ...prevChats,
          [teamId]: prevChats[teamId].map((msg) =>
            msg.id === messageId ? { ...msg, text: newText } : msg
          ),
        }));
      });

      socket.on("messageDeleted", ({ teamId, messageId }) => {
        setChats((prevChats) => ({
          ...prevChats,
          [teamId]: prevChats[teamId].filter((msg) => msg.id !== messageId),
        }));
      });

      socket.on("reactionAdded", ({ teamId, messageId, userId, reaction }) => {
        setChats((prevChats) => ({
          ...prevChats,
          [teamId]: prevChats[teamId].map((msg) => {
            if (msg.id === messageId) {
              const updatedReactions = { ...msg.reactions };
              if (updatedReactions[reaction]) {
                updatedReactions[reaction]++;
              } else {
                updatedReactions[reaction] = 1;
              }
              return { ...msg, reactions: updatedReactions };
            }
            return msg;
          }),
        }));
      });
    }
  }, [socket]);

  return (
    <ChatContext.Provider
      value={{
        sendMessage,
        getTeamChat,
        startTyping,
        stopTyping,
        typing,
        editMessage,
        deleteMessage,
        addReaction,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
