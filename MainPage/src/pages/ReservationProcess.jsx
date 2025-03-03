"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { stadiumsData } from "../data/stadiumsData";
import { MapPin, DollarSign, Clock } from "lucide-react";
import { useReservation } from "../context/ReservationContext";

const ReservationProcess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [stadium, setStadium] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [price, setPrice] = useState(null);
  const { isStadiumAvailable, addReservation } = useReservation();

  useEffect(() => {
    const foundStadium = stadiumsData.find((s) => s.id === Number(id));
    if (foundStadium) {
      setStadium(foundStadium);
      if (location.state) {
        setSelectedDate(new Date(location.state.playDate));
        setSelectedTime(location.state.playTime);
        setPrice(foundStadium.price);
      }
    } else {
      navigate("/stadiums");
    }
  }, [id, navigate, location]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setPrice(null);
  };

  const handleTimeChange = (time) => {
    if (
      isStadiumAvailable(
        stadium.id,
        selectedDate.toISOString().split("T")[0],
        time
      )
    ) {
      setSelectedTime(time);
      if (stadium) {
        setPrice(stadium.price);
      }
    } else {
      alert(
        "Bu saat artıq rezervasiya olunub. Zəhmət olmasa başqa saat seçin."
      );
    }
  };

  const handleReservation = () => {
    if (selectedDate && selectedTime && price) {
      const reservation = {
        id: Date.now(),
        stadiumId: stadium.id,
        date: selectedDate.toISOString().split("T")[0],
        time: selectedTime,
        price: price,
        userId: JSON.parse(localStorage.getItem("currentUser")).id,
        paid: false,
        expiresAt: new Date(
          selectedDate.getTime() + 24 * 60 * 60 * 1000
        ).toISOString(), // 24 hours from now
      };
      addReservation(reservation);
      navigate("/payment-process", { state: { reservation } });
    }
  };

  const handleBackToCreateTeam = () => {
    navigate("/create-team", {
      state: {
        ...location.state,
        isReserved: true,
        playDate: selectedDate,
        playTime: selectedTime,
      },
    });
  };

  if (!stadium) return <div>Yüklənir...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Rezervasiya Prosesi</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={stadium.image || "/placeholder.svg"}
            alt={stadium.name}
            className="w-full h-auto rounded-lg shadow-md mb-4"
          />
          <h2 className="text-2xl font-semibold mb-2">{stadium.name}</h2>
          <div className="flex items-center mb-2">
            <MapPin className="mr-2" size={18} />
            <span>{stadium.city}</span>
          </div>
          <div className="flex items-center mb-2">
            <DollarSign className="mr-2" size={18} />
            <span>{stadium.price} AZN/saat</span>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Tarix və Saat Seçin</h3>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            minDate={new Date()}
            inline
          />
          {selectedDate && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Mövcud Saatlar</h4>
              <div className="grid grid-cols-3 gap-2">
                {stadium.availableHours.map((hour) => (
                  <button
                    key={hour}
                    onClick={() => handleTimeChange(hour)}
                    className={`p-2 rounded ${
                      selectedTime === hour
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>
          )}
          {price && (
            <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-2">
                Rezervasiya Detalları
              </h4>
              <div className="flex items-center mb-2">
                <Clock className="mr-2" size={18} />
                <span>
                  {selectedDate.toLocaleDateString()} - {selectedTime}
                </span>
              </div>
              <div className="flex items-center mb-4">
                <DollarSign className="mr-2" size={18} />
                <span className="text-xl font-bold">{price} AZN</span>
              </div>
              <button
                onClick={handleReservation}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
              >
                Rezervasiya Et
              </button>
            </div>
          )}
          {location.state && location.state.fromCreateTeam && (
            <button
              onClick={handleBackToCreateTeam}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Team yarat səhifəsinə geri dön
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationProcess;
