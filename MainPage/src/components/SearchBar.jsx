"use client";

import { useState } from "react";
import { Search, Calendar } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ city, date });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col md:flex-row gap-4 mb-6"
    >
      <div className="flex-1 flex items-center">
        <Search className="absolute ml-3 text-gray-400" size={20} />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Şəhər seçin</option>
          <option value="Bakı">Bakı</option>
          <option value="Sumqayıt">Sumqayıt</option>
          <option value="Gəncə">Gəncə</option>
        </select>
      </div>
      <div className="flex-1 flex items-center">
        <Calendar className="absolute ml-3 text-gray-400" size={20} />
        <input
          type="date"
          value={date}
          min={today}
          onChange={(e) => setDate(e.target.value)}
          className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Axtar
      </button>
    </form>
  );
};

export default SearchBar;
