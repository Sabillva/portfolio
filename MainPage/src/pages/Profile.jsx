"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  Edit2,
  Save,
  X,
  Calendar,
  DollarSign,
} from "lucide-react";

// Bu məlumatlar normalda backend-dən gələcək
const mockUserData = {
  id: 1,
  name: "Əli Məmmədov",
  email: "ali@example.com",
  phone: "+994 50 123 45 67",
  avatar: "https://i.pravatar.cc/150?img=3",
  stats: {
    gamesPlayed: 15,
    teamsJoined: 3,
    reservations: 8,
  },
  reservationHistory: [
    {
      id: 1,
      date: "2023-06-15",
      time: "18:00-19:00",
      stadium: "Azal Arena",
      price: 50,
    },
    {
      id: 2,
      date: "2023-06-22",
      time: "19:00-20:00",
      stadium: "Dalğa Arena",
      price: 60,
    },
    {
      id: 3,
      date: "2023-06-29",
      time: "20:00-21:00",
      stadium: "Kapital Bank Arena",
      price: 45,
    },
  ],
};

const Profile = () => {
  const [user, setUser] = useState(mockUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
    // Burada backend-ə məlumatları göndərmək lazımdır
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-white font-bold mb-6">Profil</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-[#222222] rounded-3xl border-2 border-white/20 shadow-lg p-6">
            <img
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            {!isEditing ? (
              <>
                <h2 className="text-2xl font-semibold text-center text-white mb-4">
                  {user.name}
                </h2>
                <div className="space-y-2">
                  <p className="flex items-center text-white">
                    <Mail className="mr-2" size={18} /> {user.email}
                  </p>
                  <p className="flex items-center text-white">
                    <Phone className="mr-2" size={18} /> {user.phone}
                  </p>
                </div>
                <button
                  onClick={handleEdit}
                  className="w-full mt-2 bg-gradient-to-br from-green-400 to-green-600 text-gray-900 py-2 px-6 rounded-full shadow-lg hover:bg-gradient-to-bl hover:shadow-2xl transition duration-300 flex items-center justify-center"
                >
                  <Edit2 className="mr-2" size={18} />
                  Redaktə et
                </button>
              </>
            ) : (
              <form
                onSubmit={(e) => e.preventDefault()}
                className="space-y-4 bg-[#333] border-2 border-white/20 p-4 rounded-lg"
              >
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editedUser.name}
                    onChange={handleChange}
                    className="w-full p-2 border-2 border-white/20 rounded-3xl bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">
                    E-poçt
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleChange}
                    className="w-full p-2 border-2 border-white/20 rounded-3xl bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={editedUser.phone}
                    onChange={handleChange}
                    className="w-full p-2 border-2 border-white/20 rounded-3xl bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-br from-green-400 to-green-600 text-gray-900 py-2 px-6 rounded-full shadow-lg hover:bg-gradient-to-bl hover:shadow-2xl transition duration-300 flex items-center justify-center"
                  >
                    <Save className="mr-2" size={18} />
                    Yadda saxla
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gradient-to-br from-red-400 to-red-600 text-gray-900 py-2 px-6 rounded-full shadow-lg hover:bg-gradient-to-bl hover:shadow-2xl transition duration-300 flex items-center justify-center"
                  >
                    <X className="mr-2" size={18} />
                    Ləğv et
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="bg-[#222] rounded-3xl border-2 border-white/20 shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Statistika
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {user.stats.gamesPlayed}
                </p>
                <p className="text-gray-400">Oynanılmış oyunlar</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {user.stats.teamsJoined}
                </p>
                <p className="text-gray-400">Qoşulduğu komandalar</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {user.stats.reservations}
                </p>
                <p className="text-gray-400">Rezervasiyalar</p>
              </div>
            </div>
          </div>

          <div className="bg-[#222] rounded-3xl border-2 border-white/20 shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Rezervasiya Tarixçəsi
            </h3>
            <div className="space-y-4">
              {user.reservationHistory.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-semibold text-white">
                      {reservation.stadium}
                    </p>
                    <p className="text-sm text-gray-400 flex items-center">
                      <Calendar className="mr-1" size={14} />
                      {reservation.date} | {reservation.time}
                    </p>
                  </div>
                  <p className="font-semibold text-white flex items-center">
                    <DollarSign className="mr-1" size={14} />
                    {reservation.price} AZN
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
