"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import StadiumList from "../components/StadiumList";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";
import { stadiumsData } from "../data/stadiumsData";
import { LogOut } from "lucide-react";

const Stadiums = () => {
  const [filteredStadiums, setFilteredStadiums] = useState(stadiumsData);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    city: "",
    date: "",
    maxPrice: 100,
    maxDistance: "",
    timeSlot: "",
    shower: false,
    changingRoom: false,
    tea: false,
    parking: false,
    camera: false,
  });

  const stadiumsPerPage = 6;

  useEffect(() => {
    const filtered = stadiumsData.filter((stadium) => {
      if (filters.city && stadium.city !== filters.city) return false;
      if (filters.maxPrice && stadium.price > filters.maxPrice) return false;
      if (filters.maxDistance && stadium.distance > filters.maxDistance)
        return false;
      if (
        filters.timeSlot &&
        !stadium.availableHours.includes(filters.timeSlot)
      )
        return false;
      if (filters.shower && !stadium.facilities.shower) return false;
      if (filters.changingRoom && !stadium.facilities.changingRoom)
        return false;
      if (filters.tea && !stadium.facilities.tea) return false;
      if (filters.parking && !stadium.facilities.parking) return false;
      if (filters.camera && !stadium.facilities.camera) return false;
      return true;
    });
    setFilteredStadiums(filtered);
    setCurrentPage(1);
  }, [filters]);

  const handleSearch = ({ city, date }) => {
    setFilters((prevFilters) => ({ ...prevFilters, city, date }));
  };

  const indexOfLastStadium = currentPage * stadiumsPerPage;
  const indexOfFirstStadium = indexOfLastStadium - stadiumsPerPage;
  const currentStadiums = filteredStadiums.slice(
    indexOfFirstStadium,
    indexOfLastStadium
  );

  const totalPages = Math.ceil(filteredStadiums.length / stadiumsPerPage);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.setItem("isLoggedIn", "false");
    navigate("/login");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Stadionlar</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300 flex items-center"
        >
          <LogOut size={18} className="mr-2" />
          Çıxış
        </button>
      </div>
      <SearchBar onSearch={handleSearch} />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <Filters filters={filters} setFilters={setFilters} />
        </div>
        <div className="md:w-3/4">
          <StadiumList stadiums={currentStadiums} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Stadiums;
