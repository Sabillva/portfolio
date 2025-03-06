"use client";

import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const sendVerificationEmail = useCallback((email, code) => {
    // In a real application, you would send an email here
    console.log(`Verification code ${code} sent to ${email}`);
    // For demo purposes, we'll show an alert
    alert(
      `Verification code is: ${code}. In a real app, this would be sent to ${email}`
    );
  }, []);

  const clearUnusedLocalStorage = useCallback(() => {
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
    } catch (err) {
      console.error("Error clearing localStorage:", err);
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (isSubmitting) return;
      setIsSubmitting(true);
      setError("");

      try {
        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
        const userExists = existingUsers.some((user) => user.email === email);

        if (userExists) {
          setError("Bu email ünvanı ilə artıq qeydiyyatdan keçilmişdir.");
          setIsSubmitting(false);
          return;
        }

        // Generate and "send" verification code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(code);
        sendVerificationEmail(email, code);
        setShowVerification(true);
      } catch (err) {
        setError(
          "Qeydiyyat zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin."
        );
        console.error("Registration error:", err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, isSubmitting, sendVerificationEmail]
  );

  const handleVerification = useCallback(
    async (e) => {
      e.preventDefault();

      if (isSubmitting) return;
      setIsSubmitting(true);
      setError("");

      try {
        if (verificationCode === generatedCode) {
          // Try to clear some space first
          clearUnusedLocalStorage();

          const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            phone,
            profileImage: null,
          };

          // Try to save with minimal data from the start
          const minimalUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
          };

          try {
            const existingUsers =
              JSON.parse(localStorage.getItem("users")) || [];

            // Keep only the most recent 10 users
            const recentUsers = [...existingUsers, minimalUser]
              .sort((a, b) => b.id - a.id)
              .slice(0, 10);

            localStorage.setItem("users", JSON.stringify(recentUsers));
            localStorage.setItem("currentUser", JSON.stringify(minimalUser));
            localStorage.setItem("isLoggedIn", "true");

            navigate("/stadiums");
          } catch (storageError) {
            console.error("Storage error:", storageError);

            // If quota exceeded, try with even more minimal data
            if (storageError.name === "QuotaExceededError") {
              localStorage.clear(); // Clear everything

              const veryMinimalUser = {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
              };

              localStorage.setItem(
                "currentUser",
                JSON.stringify(veryMinimalUser)
              );
              localStorage.setItem("isLoggedIn", "true");

              navigate("/stadiums");
            } else {
              throw storageError;
            }
          }
        } else {
          setError("Yanlış təsdiq kodu. Zəhmət olmasa yenidən cəhd edin.");
        }
      } catch (err) {
        setError(
          "Təsdiq zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin."
        );
        console.error("Verification error:", err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      verificationCode,
      generatedCode,
      name,
      email,
      password,
      phone,
      isSubmitting,
      navigate,
      clearUnusedLocalStorage,
    ]
  );

  if (showVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Email ünvanınızı təsdiqləyin
          </h2>

          {error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-lg text-center">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleVerification}>
            <input
              type="text"
              required
              className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-[#222] placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="6 rəqəmli kodu daxil edin"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-gray-900 bg-gradient-to-br from-green-400 to-green-600 hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Təsdiqlənir..." : "Təsdiqlə"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Yeni hesab yaradın
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
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-t-lg relative block w-full px-3 py-3 border border-gray-700 bg-[#222] placeholder-gray-400 text-white focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Ad Soyad"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-[#222] placeholder-gray-400 text-white focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-[#222] placeholder-gray-400 text-white focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Şifrə"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="appearance-none rounded-b-lg relative block w-full px-3 py-3 border border-gray-700 bg-[#222] placeholder-gray-400 text-white focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Telefon nömrəsi"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-gray-900 bg-gradient-to-br from-green-400 to-green-600 hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Qeydiyyat aparılır..." : "Qeydiyyatdan keç"}
            </button>
          </div>
        </form>
        <div className="text-center">
          <Link
            to="/login"
            className="font-medium text-green-500 hover:text-green-400"
          >
            Artıq hesabınız var? Daxil olun
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
