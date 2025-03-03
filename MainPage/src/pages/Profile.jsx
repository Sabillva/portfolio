"use client";

import { useState, useEffect } from "react";
import { Edit2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      setUser(currentUser);
      setEditedUser(currentUser);
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);

    // Istifadəçi məlumatlarını yenilə
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.id === editedUser.id ? { ...u, ...editedUser, email: u.email } : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem(
      "currentUser",
      JSON.stringify({ ...editedUser, email: user.email })
    );
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newProfileImage = reader.result;
        setEditedUser((prev) => ({ ...prev, profileImage: newProfileImage }));
        // Save to localStorage immediately
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const updatedUser = { ...currentUser, profileImage: newProfileImage };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        // Update users array in localStorage
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const updatedUsers = users.map((u) =>
          u.id === currentUser.id ? updatedUser : u
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.setItem("isLoggedIn", "false");
    navigate("/login");
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Profil</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <div className="relative">
            <img
              src={user.profileImage || "/placeholder.svg"}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover"
            />
            <label
              htmlFor="profile-image"
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer"
            >
              <Edit2 size={16} />
            </label>
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={!isEditing}
            />
          </div>
          <div className="ml-6">
            {!isEditing ? (
              <>
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-600">{user.phone}</p>
              </>
            ) : (
              <>
                <input
                  type="text"
                  name="name"
                  value={editedUser.name}
                  onChange={handleChange}
                  className="mt-2 p-2 border rounded w-full"
                />
                <p className="text-gray-600 mt-2">{user.email}</p>
                <input
                  type="tel"
                  name="phone"
                  value={editedUser.phone}
                  onChange={handleChange}
                  className="mt-2 p-2 border rounded w-full"
                />
              </>
            )}
          </div>
        </div>
        {!isEditing ? (
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Redaktə et
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300 flex items-center"
            >
              <LogOut size={18} className="mr-2" />
              Çıxış
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
            >
              Yadda saxla
            </button>
            <button
              onClick={handleCancel}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
            >
              Ləğv et
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
