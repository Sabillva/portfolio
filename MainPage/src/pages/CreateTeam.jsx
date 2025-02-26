"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTeams } from "../context/TeamsContext.jsx";
import { stadiumsData } from "../data/stadiumsData.js";

const CreateTeam = () => {
  const navigate = useNavigate();
  const { addTeam } = useTeams();
  const [teamName, setTeamName] = useState("");
  const [city, setCity] = useState("");
  const [playDate, setPlayDate] = useState("");
  const [playTime, setPlayTime] = useState("");
  const [playerCount, setPlayerCount] = useState(5);
  const [stadiumId, setStadiumId] = useState("");
  const [availableStadiums, setAvailableStadiums] = useState([]);
  const [logo, setLogo] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    if (city) {
      const filteredStadiums = stadiumsData.filter(
        (stadium) => stadium.city === city
      );
      setAvailableStadiums(filteredStadiums);
    } else {
      setAvailableStadiums([]);
    }
    setStadiumId("");
  }, [city]);

  useEffect(() => {
    if (stadiumId && playDate) {
      const stadium = stadiumsData.find(
        (s) => s.id === Number.parseInt(stadiumId)
      );
      if (stadium) {
        // Bu hissədə normalda backend-dən mövcud saatları almalıyam
        setAvailableTimes(stadium.availableHours);
      }
    } else {
      setAvailableTimes([]);
    }
    setPlayTime("");
  }, [stadiumId, playDate]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedStadium = stadiumsData.find(
      (stadium) => stadium.id === Number.parseInt(stadiumId)
    );
    const newTeam = {
      name: teamName,
      city,
      playDate,
      playTime,
      playerCount,
      currentPlayers: 1,
      stadium: selectedStadium ? selectedStadium.name : "",
      stadiumId: Number.parseInt(stadiumId),
      logo,
    };
    addTeam(newTeam);
    navigate("/teams");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Komanda Yarat</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6"
      >
        <div className="mb-4">
          <label htmlFor="teamName" className="block text-sm font-medium mb-1">
            Komanda Adı
          </label>
          <input
            type="text"
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            Şəhər
          </label>
          <select
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Şəhər seçin</option>
            <option value="Bakı">Bakı</option>
            <option value="Sumqayıt">Sumqayıt</option>
            <option value="Gəncə">Gəncə</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="stadium" className="block text-sm font-medium mb-1">
            Stadion
          </label>
          <select
            id="stadium"
            value={stadiumId}
            onChange={(e) => setStadiumId(e.target.value)}
            className="w-full p-2 border rounded"
            required
            disabled={!city}
          >
            <option value="">Stadion seçin</option>
            {availableStadiums.map((stadium) => (
              <option key={stadium.id} value={stadium.id}>
                {stadium.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="playDate" className="block text-sm font-medium mb-1">
            Oyun Tarixi
          </label>
          <input
            type="date"
            id="playDate"
            value={playDate}
            onChange={(e) => setPlayDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="playTime" className="block text-sm font-medium mb-1">
            Oyun Saatı
          </label>
          <select
            id="playTime"
            value={playTime}
            onChange={(e) => setPlayTime(e.target.value)}
            className="w-full p-2 border rounded"
            required
            disabled={!stadiumId || !playDate}
          >
            <option value="">Saat seçin</option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="playerCount"
            className="block text-sm font-medium mb-1"
          >
            Oyunçu Sayı
          </label>
          <input
            type="number"
            id="playerCount"
            value={playerCount}
            onChange={(e) => setPlayerCount(Number.parseInt(e.target.value))}
            min="5"
            max="11"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="logo" className="block text-sm font-medium mb-1">
            Komanda Logosu
          </label>
          <input
            type="file"
            id="logo"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full p-2 border rounded"
          />
          {logo && (
            <img
              src={logo || "/placeholder.svg"}
              alt="Team Logo"
              className="mt-2 w-20 h-20 object-cover rounded"
            />
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Komanda Yarat
        </button>
      </form>
    </div>
  );
};

export default CreateTeam;
