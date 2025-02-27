"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTeams } from "../context/TeamsContext";
import { useChat } from "../context/ChatContext";
import EmojiPicker from "emoji-picker-react";
import { format, differenceInMinutes } from "date-fns";
import {
  Smile,
  Send,
  Edit2,
  Trash2,
  ThumbsUp,
  Heart,
  Laugh,
} from "lucide-react";

const Chat = () => {
  const navigate = useNavigate();
  const { teams } = useTeams();
  const {
    sendMessage,
    getTeamChat,
    startTyping,
    stopTyping,
    typing,
    editMessage,
    deleteMessage,
    addReaction,
  } = useChat();
  const [userTeam, setUserTeam] = useState(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const messagesEndRef = useRef(null);

  // Bu hissədə normalde istifadəçinin ID-sini sessiyadan və ya başqa bir mənbədən almalısınız
  const userId = 1; // Müvəqqəti olaraq sabit bir ID istifadə edirik

  useEffect(() => {
    const team = teams.find((t) => t.members.some((m) => m.id === userId));
    if (team) {
      setUserTeam(team);
      setChatMessages(getTeamChat(team.id));
    } else {
      navigate("/teams");
    }
  }, [teams, navigate, getTeamChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesEndRef]); // Corrected dependency

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && userTeam) {
      const newMessage = {
        id: Date.now(),
        sender: userId,
        senderName: "Current User", // Burada istifadəçinin adını əlavə edin
        text: message,
        timestamp: new Date().toISOString(),
        reactions: {},
      };
      sendMessage(userTeam.id, newMessage);
      setMessage("");
      setShowEmojiPicker(false);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    startTyping(userTeam.id, userId);
  };

  const handleInputBlur = () => {
    stopTyping(userTeam.id, userId);
  };

  const handleEditMessage = (messageId) => {
    const messageToEdit = chatMessages.find((msg) => msg.id === messageId);
    if (
      messageToEdit &&
      differenceInMinutes(new Date(), new Date(messageToEdit.timestamp)) <= 15
    ) {
      setEditingMessageId(messageId);
      setMessage(messageToEdit.text);
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingMessageId && message.trim() && userTeam) {
      editMessage(userTeam.id, editingMessageId, message);
      setEditingMessageId(null);
      setMessage("");
    }
  };

  const handleDeleteMessage = (messageId) => {
    if (
      window.confirm("Bu mesajı silmək istədiyinizə əminsiniz?") &&
      userTeam
    ) {
      deleteMessage(userTeam.id, messageId);
    }
  };

  const handleReaction = (messageId, reaction) => {
    if (userTeam) {
      addReaction(userTeam.id, messageId, userId, reaction);
    }
  };

  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach((msg) => {
      const date = format(new Date(msg.timestamp), "yyyy-MM-dd");
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(msg);
    });
    return grouped;
  };

  const groupedMessages = groupMessagesByDate(chatMessages);

  if (!userTeam) {
    return <div>Yüklənir...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-white font-bold mb-6">
        {userTeam.name} Komanda Çatı
      </h1>
      <div className="bg-[#181818] rounded-xl shadow-2xl p-6 border border-gray-700">
        {/* Mesajlar */}
        <div className="h-[500px] overflow-y-auto mb-4 p-4 border border-gray-600 rounded-lg bg-[#222] shadow-inner">
          {Object.entries(groupedMessages).map(([date, messages]) => (
            <div key={date}>
              {/* Tarix */}
              <div className="text-center text-sm text-gray-400 my-2">
                {format(new Date(date), "dd MMMM yyyy")}
              </div>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-3 ${
                    msg.sender === userId ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`flex w-full ${
                      msg.sender === userId ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Mesaj */}
                    <span
                      className={`relative min-w-[220px] max-w-[65%] p-4 rounded-xl shadow-lg ${
                        msg.sender === userId
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                          : "bg-gray-800 text-gray-200"
                      }`}
                    >
                      {/* Göndərən Adı */}
                      <div className="font-semibold text-sm text-gray-300">
                        {msg.sender === userId ? "Siz" : msg.senderName}
                      </div>

                      {/* Mesaj Mətn */}
                      <div className="mt-1 text-[15px]">{msg.text}</div>

                      {/* Zaman */}
                      <div className="text-xs mt-2 text-gray-400 text-right">
                        {format(new Date(msg.timestamp), "HH:mm")}
                      </div>
                    </span>
                  </div>

                  {/* Redaktə və Sil düymələri */}
                  {msg.sender === userId &&
                    differenceInMinutes(new Date(), new Date(msg.timestamp)) <=
                      15 && (
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => handleEditMessage(msg.id)}
                          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300 shadow-md"
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition duration-300 shadow-md"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}

                  {/* Reaksiya düymələri */}
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleReaction(msg.id, "thumbsUp")}
                      className="p-2 rounded-full bg-[#222] text-white hover:bg-green-500 hover:scale-105 transition-all duration-300 flex items-center space-x-1"
                    >
                      <ThumbsUp size={20} />
                      <span className="text-sm text-gray-300">
                        {msg.reactions?.thumbsUp || 0}
                      </span>
                    </button>

                    <button
                      onClick={() => handleReaction(msg.id, "heart")}
                      className="p-2 rounded-full bg-[#222] text-white hover:bg-red-500 hover:scale-105 transition-all duration-300 flex items-center space-x-1"
                    >
                      <Heart size={20} />
                      <span className="text-sm text-gray-300">
                        {msg.reactions?.heart || 0}
                      </span>
                    </button>

                    <button
                      onClick={() => handleReaction(msg.id, "laugh")}
                      className="p-2 rounded-full bg-[#222] text-white hover:bg-yellow-500 hover:scale-105 transition-all duration-300 flex items-center space-x-1"
                    >
                      <Laugh size={20} />
                      <span className="text-sm text-gray-300">
                        {msg.reactions?.laugh || 0}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Yazı Paneli */}
        {typing[userTeam.id] &&
          Object.values(typing[userTeam.id]).some((isTyping) => isTyping) && (
            <div className="text-sm text-gray-400 mb-2">Kimsə yazır...</div>
          )}

        <form
          onSubmit={editingMessageId ? handleSaveEdit : handleSendMessage}
          className="flex items-center space-x-3 bg-[#222] rounded-3xl border border-gray-600 p-4 shadow-lg"
        >
          {/* Emoji Düyməsi */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 rounded-full text-white bg-gray-700 border border-gray-500 hover:bg-gray-600 active:bg-gray-500 transition-all duration-300"
          >
            <Smile size={24} />
          </button>

          {/* Input */}
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="w-full pl-4 pr-4 py-3 rounded-full text-white bg-[#181818] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 hover:bg-[#222] transition-all duration-300 ease-in-out"
            placeholder={
              editingMessageId
                ? "Mesajı redaktə edin..."
                : "Mesajınızı yazın..."
            }
          />

          {/* Göndər Düyməsi */}
          <button
            type="submit"
            className="px-6 py-3 min-w-[150px] bg-gradient-to-br from-green-400 to-green-600 text-black font-medium rounded-full transform transition-all duration-300 hover:bg-gradient-to-bl active:scale-95 active:from-green-600 active:to-green-400 flex items-center"
          >
            {editingMessageId ? (
              <Edit2 size={20} className="mr-2" />
            ) : (
              <Send size={20} className="mr-2" />
            )}
            {editingMessageId ? "Redaktə et" : "Göndər"}
          </button>
        </form>

        {/* Emoji Paneli */}
        {showEmojiPicker && (
          <div className="mt-2">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
