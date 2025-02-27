"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { stadiumsData } from "../data/stadiumsData";
import { MapPin, DollarSign, Clock } from "lucide-react";

const ReservationProcess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stadium, setStadium] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const foundStadium = stadiumsData.find((s) => s.id === Number.parseInt(id));
    if (foundStadium) {
      setStadium(foundStadium);
    } else {
      navigate("/stadiums");
    }
  }, [id, navigate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setPrice(null);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    if (stadium) {
      setPrice(stadium.price);
    }
  };

  const handlePaymentProcess = () => {
    // Navigate to the payment process with the selected data
    navigate("/payment-process", {
      state: {
        stadiumId: stadium.id,
        date: selectedDate,
        time: selectedTime,
        price: price,
      },
    });
  };

  if (!stadium) {
    return <div className="text-center text-xl text-gray-500">Yüklənir...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-6 text-white">
        Rezervasiya Prosesi
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Stadium Info */}
        <div className="bg-[#222] rounded-3xl border-2 border-white/20 shadow-lg p-6">
          <img
            src={stadium.image || "/placeholder.svg"}
            alt={stadium.name}
            className="w-full h-56 object-cover rounded-2xl mb-4"
          />
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              {stadium.name}
            </h2>
            <div className="flex items-center text-gray-300">
              <MapPin className="mr-2" size={18} />
              <span>{stadium.city}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <DollarSign className="mr-2" size={18} />
              <span>{stadium.price} AZN/saat</span>
            </div>
          </div>
        </div>

        {/* Reservation Form */}
        <div className="bg-[#222] rounded-3xl border-2 border-white/20 shadow-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Tarix və Saat Seçin
          </h3>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            minDate={new Date()}
            inline
            className="rounded-lg border-2 border-gray-600 text-white bg-[#2A2A2A] p-4 w-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            calendarClassName="rounded-lg shadow-lg bg-[#2A2A2A] text-white"
            dayClassName={(date) =>
              date.getDay() === 0 || date.getDay() === 6
                ? "text-red-500" // Highlight weekends with red
                : "text-white"
            }
          />

          {selectedDate && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold text-white mb-4">
                Mövcud Saatlar
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {stadium.availableHours.map((hour) => (
                  <button
                    key={hour}
                    onClick={() => handleTimeChange(hour)}
                    className={`px-6 py-2 rounded-3xl font-semibold shadow-lg transform transition-all duration-300 
                   ${
                     selectedTime === hour
                       ? "bg-gradient-to-br from-green-400 to-green-600 text-black shadow-2xl scale-105"
                       : "bg-gradient-to-br from-[#333] to-[#333] text-white hover:bg-gradient-to-bl hover:from-green-400 hover:to-green-600 hover:scale-105 hover:shadow-2xl"
                   } 
                   active:scale-95 active:from-green-600 active:to-green-400`}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>
          )}

          {price && (
           <div className="mt-6 p-4 bg-[#333] rounded-3xl border-2 border-white/20 shadow-md text-white">
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
             onClick={handlePaymentProcess}
             className="w-full bg-[#222] text-white py-2 px-6 rounded-full border-2 border-white text-center font-medium shadow-lg transform transition-all duration-300 hover:bg-white hover:text-[#222] hover:border-[#222] hover:scale-102"
           >
             Ödənişə Keç
           </button>
         </div>
         
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationProcess;
