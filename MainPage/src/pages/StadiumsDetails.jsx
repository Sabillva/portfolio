"use client";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  DollarSign,
  Clock,
  Droplet,
  Shirt,
  Coffee,
  Car,
  Camera,
} from "lucide-react";
import { stadiumsData } from "../data/stadiumsData";

const StadiumDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const stadium = stadiumsData.find((s) => s.id === Number.parseInt(id));

  if (!stadium) {
    return <div>Stadion tapılmadı</div>;
  }

  const handleReservation = () => {
    navigate(`/reservation/${stadium.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-[#222] rounded-3xl border-2 border-white/20 shadow-lg p-6 transition transform">
        {/* Stadion Şəkili */}
        <img
          src={stadium.image || "/placeholder.svg"}
          alt={stadium.name}
          className="w-full h-56 object-cover rounded-2xl mb-4"
        />

        {/* Stadion Məlumatları */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">{stadium.name}</h3>

          <div className="flex items-center text-gray-300">
            <MapPin className="mr-2" size={18} />
            <span>{stadium.city}</span>
          </div>

          <div className="flex items-center text-gray-300">
            <DollarSign className="mr-2" size={18} />
            <span>{stadium.price} AZN/saat</span>
          </div>

          <div className="flex items-center text-gray-300">
            <Clock className="mr-2" size={18} />
            <span>Mövcud saatlar: {stadium.availableHours.join(", ")}</span>
          </div>

          <h3 className="text-xl font-semibold text-white">İmkanlar</h3>
          <div className="grid grid-cols-2 gap-4 mb-6 text-white">
            <div className="flex items-center ">
              <Droplet
                className={`mr-2 ${
                  stadium.facilities.shower ? "text-green-500" : "text-red-500"
                }`}
              />
              <span>Duş</span>
            </div>
            <div className="flex items-center">
              <Shirt
                className={`mr-2 ${
                  stadium.facilities.changingRoom
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              />
              <span>Soyunub-geyinmə otağı</span>
            </div>
            <div className="flex items-center">
              <Coffee
                className={`mr-2 ${
                  stadium.facilities.tea ? "text-green-500" : "text-red-500"
                }`}
              />
              <span>Çay</span>
            </div>
            <div className="flex items-center">
              <Car
                className={`mr-2 ${
                  stadium.facilities.parking ? "text-green-500" : "text-red-500"
                }`}
              />
              <span>Parking</span>
            </div>
            <div className="flex items-center">
              <Camera
                className={`mr-2 ${
                  stadium.facilities.camera ? "text-green-500" : "text-red-500"
                }`}
              />
              <span>Kamera</span>
            </div>
          </div>

          {/* Rezervasiya Buttonu */}
          <button
            onClick={handleReservation}
            className="w-full bg-[#222] text-white py-2 px-6 rounded-full border-2 border-white text-center font-medium transition-all duration-300 shadow-lg hover:bg-white hover:text-[#222] hover:border-[#222] hover:scale-102"
          >
            Rezervasiya Et
          </button>
        </div>
      </div>
    </div>
  );
};

export default StadiumDetails;
