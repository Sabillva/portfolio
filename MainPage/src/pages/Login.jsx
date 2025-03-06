"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    try {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        // Optimize the user data to store only what's needed
        const essentialUserData = {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          profileImage: user.profileImage,
        };

        try {
          // Try to store the optimized user data
          localStorage.setItem(
            "currentUser",
            JSON.stringify(essentialUserData)
          );
          localStorage.setItem("isLoggedIn", "true");

          // Clear some space if needed
          clearUnusedLocalStorage();

          navigate("/stadiums");
        } catch (storageError) {
          // If storage error occurs, try to clear space and retry
          if (storageError.name === "QuotaExceededError") {
            clearUnusedLocalStorage();

            // Try again with even more minimal data
            const minimalUserData = {
              id: user.id,
              name: user.name,
              email: user.email,
            };

            localStorage.setItem(
              "currentUser",
              JSON.stringify(minimalUserData)
            );
            localStorage.setItem("isLoggedIn", "true");
            navigate("/stadiums");
          } else {
            throw storageError;
          }
        }
      } else {
        setError("Email və ya şifrə yanlışdır!");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Giriş zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
    }
  };

  // Function to clear unused localStorage items
  const clearUnusedLocalStorage = () => {
    try {
      // Clear old or less important data
      const keysToPreserve = ["users", "currentUser", "isLoggedIn"];

      // Get all keys in localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        // Skip essential keys
        if (keysToPreserve.includes(key)) continue;

        // Remove other items
        localStorage.removeItem(key);
      }

      // If profile image is too large, remove it
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (
        currentUser &&
        currentUser.profileImage &&
        currentUser.profileImage.length > 10000
      ) {
        currentUser.profileImage = null;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
      }
    } catch (err) {
      console.error("Error clearing localStorage:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Hesabınıza daxil olun
          </h2>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-t-lg relative block w-full px-3 py-3 border border-gray-700 bg-[#222] placeholder-gray-400 text-white focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-b-lg relative block w-full px-3 py-3 border border-gray-700 bg-[#222] placeholder-gray-400 text-white focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Şifrə"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-gray-900 bg-gradient-to-br from-green-400 to-green-600 hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
            >
              Daxil ol
            </button>
          </div>
        </form>
        <div className="text-center">
          <Link
            to="/register"
            className="font-medium text-green-500 hover:text-green-400"
          >
            Hesabınız yoxdur? Qeydiyyatdan keçin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
