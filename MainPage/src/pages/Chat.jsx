"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTeams } from "../context/TeamsContext";
import { useChat } from "../context/ChatContext";

const Chat = () => {
  const { teamId } = useParams();
  const { teams } = useTeams();
  const { messages, sendMessage, deleteMessage, editMessage } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);

  const team = teams.find((t) => t.id === Number(teamId));
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    // Scroll to bottom when new messages are added
    const chatContainer = document.getElementById("chat-container");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(teamId, {
        id: Date.now(),
        sender: currentUser.id,
        text: newMessage,
        timestamp: new Date().toISOString(),
        readBy: [currentUser.id],
      });
      setNewMessage("");
    }
  };

  const handleDeleteMessage = (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      deleteMessage(teamId, messageId);
    }
  };

  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setNewMessage(message.text);
  };

  const handleSaveEdit = () => {
    if (newMessage.trim()) {
      editMessage(teamId, editingMessage.id, newMessage);
      setEditingMessage(null);
      setNewMessage("");
    }
  };

  const canEditOrDelete = (message) => {
    const timeDiff = (new Date() - new Date(message.timestamp)) / (1000 * 60);
    return message.sender === currentUser.id && timeDiff <= 20;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {team ? `${team.name} Chat` : "Chat"}
      </h1>
      <div
        id="chat-container"
        className="bg-white rounded-lg shadow-md p-6 h-96 overflow-y-auto mb-4"
      >
        {messages.map((message) => (
          <div key={message.id} className="mb-4">
            <p className="font-bold">
              {message.sender === currentUser.id ? "You" : message.senderName}
            </p>
            <p>{message.text}</p>
            <p className="text-sm text-gray-500">
              {new Date(message.timestamp).toLocaleString()}
            </p>
            {canEditOrDelete(message) && (
              <div>
                <button
                  onClick={() => handleEditMessage(message)}
                  className="text-blue-500 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteMessage(message.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <form
        onSubmit={editingMessage ? handleSaveEdit : handleSendMessage}
        className="flex"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow p-2 border rounded-l"
          placeholder={
            editingMessage ? "Edit your message..." : "Type your message..."
          }
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition duration-300"
        >
          {editingMessage ? "Save" : "Send"}
        </button>
      </form>
      <Link to={`/team/${teamId}`} className="mt-4 inline-block text-blue-500">
        Back to Team Details
      </Link>
    </div>
  );
};

export default Chat;
