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
      <h1 className="text-3xl font-bold mb-6">{stadium.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={stadium.image || "/placeholder.svg"}
            alt={stadium.name}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <MapPin className="mr-2" />
              <span>{stadium.city}</span>
            </div>
            <div className="flex items-center mb-4">
              <DollarSign className="mr-2" />
              <span>{stadium.price} AZN/saat</span>
            </div>
            <div className="flex items-center mb-4">
              <Clock className="mr-2" />
              <span>Mövcud saatlar: {stadium.availableHours.join(", ")}</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">İmkanlar</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <Droplet
                  className={`mr-2 ${
                    stadium.facilities.shower
                      ? "text-green-500"
                      : "text-red-500"
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
                    stadium.facilities.parking
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                />
                <span>Parking</span>
              </div>
              <div className="flex items-center">
                <Camera
                  className={`mr-2 ${
                    stadium.facilities.camera
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                />
                <span>Kamera</span>
              </div>
            </div>
            <button
              onClick={handleReservation}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Rezervasiya Et
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StadiumDetails;
