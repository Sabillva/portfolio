"use client";

import { useState } from "react";
import { Search, Calendar } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ city, date });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-[#222] rounded-3xl border-2 border-white/20"
    >
      {/* City Dropdown */}
      <div className="relative w-full max-w-md mx-auto">
        <div
          className="flex items-center border-2 border-white/20 rounded-full p-2 bg-[#222] cursor-pointer transition focus-within:border-gray-500 w-full"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Search className="text-gray-400 ml-3" size={20} />
          <span className="flex-1 text-white px-2">
            {city || "Şəhər seçin"}
          </span>
        </div>

        {isDropdownOpen && (
          <div className="absolute z-10 bg-[#222] border-2 border-white/20 rounded-lg w-full mt-1">
            <div
              onClick={() => {
                setCity("Bakı");
                setIsDropdownOpen(false);
              }}
              className="px-4 py-2 text-white hover:bg-green-400 cursor-pointer border-white/20 rounded-lg"
            >
              Bakı
            </div>
            <div
              onClick={() => {
                setCity("Sumqayıt");
                setIsDropdownOpen(false);
              }}
              className="px-4 py-2 text-white hover:bg-green-400 cursor-pointer border-white/20 rounded-lg"
            >
              Sumqayıt
            </div>
            <div
              onClick={() => {
                setCity("Gəncə");
                setIsDropdownOpen(false);
              }}
              className="px-4 py-2 text-white hover:bg-green-400 cursor-pointer border-white/20 rounded-lg"
            >
              Gəncə
            </div>
          </div>
        )}
      </div>

      {/* Date Input */}
      <div className="flex-1 flex items-center relative">
        {/* Calendar icon */}
        <Calendar className="absolute ml-4 text-gray-400" size={20} />

        {/* Date input */}
        <input
          type="date"
          value={date}
          min={today}
          onChange={(e) => setDate(e.target.value)}
          className="w-full pl-12 pr-4 py-2 rounded-xl bg-gray-800 text-white border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 hover:bg-gray-700 transition-all duration-300 ease-in-out"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="px-6 py-2 bg-gradient-to-br from-green-400 to-green-600 text-gray-900 rounded-full shadow-lg transform transition-all duration-300 hover:bg-gradient-to-bl hover:shadow-2xl hover:scale-105 active:scale-95 active:from-green-600 active:to-green-400"
      >
        Axtar
      </button>
    </form>
  );
};

export default SearchBar;
