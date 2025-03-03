"use client";

import { createContext, useState, useContext, useEffect } from "react";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const storedMessages =
      JSON.parse(localStorage.getItem("chatMessages")) || {};
    setMessages(storedMessages);
  }, []);

  const saveMessages = (newMessages) => {
    setMessages(newMessages);
    localStorage.setItem("chatMessages", JSON.stringify(newMessages));
  };

  const sendMessage = (teamId, message) => {
    const teamMessages = messages[teamId] || [];
    const newMessages = {
      ...messages,
      [teamId]: [...teamMessages, message],
    };
    saveMessages(newMessages);
  };

  const deleteMessage = (teamId, messageId) => {
    const teamMessages = messages[teamId] || [];
    const newTeamMessages = teamMessages.filter((m) => m.id !== messageId);
    const newMessages = {
      ...messages,
      [teamId]: newTeamMessages,
    };
    saveMessages(newMessages);
  };

  const editMessage = (teamId, messageId, newText) => {
    const teamMessages = messages[teamId] || [];
    const newTeamMessages = teamMessages.map((m) =>
      m.id === messageId ? { ...m, text: newText } : m
    );
    const newMessages = {
      ...messages,
      [teamId]: newTeamMessages,
    };
    saveMessages(newMessages);
  };

  return (
    <ChatContext.Provider
      value={{ messages, sendMessage, deleteMessage, editMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
};
