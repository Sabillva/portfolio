"use client";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DollarSign, Calendar } from "lucide-react";

const PaymentProcess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { stadiumId, date, time, price } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/payment-confirmation", {
      state: {
        stadiumId,
        date,
        time,
        price,
        paymentMethod,
      },
    });
  };

  if (!stadiumId || !date || !time || !price) {
    return <div>Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        Ödəniş Prosesi
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Rezervasiya Məlumatları */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-white">
            Rezervasiya Məlumatları
          </h2>
          <div className="bg-[#333] text-white rounded-3xl border-2 border-white/20 shadow-md p-6">
            <div className="flex items-center mb-4">
              <Calendar className="mr-2" size={18} />
              <span>
                {new Date(date).toLocaleDateString()} - {time}
              </span>
            </div>
            <div className="flex items-center mb-4">
              <DollarSign className="mr-2" size={18} />
              <span className="text-xl font-bold">{price} AZN</span>
            </div>
          </div>
        </div>

        {/* Ödəniş Məlumatları */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-white">
            Ödəniş Məlumatları
          </h2>
          <form
            onSubmit={handleSubmit}
            className="bg-[#333] rounded-3xl border-2 border-white/20 shadow-md p-6"
          >
            <div className="relative w-full mb-3">
              <label className="block text-sm font-medium mb-2 text-white">
                Ödəniş Metodu
              </label>
              <div
                className="flex items-center border-2 border-white/20 rounded-full p-2 bg-[#222] cursor-pointer transition focus-within:border-gray-500 w-full"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <DollarSign className="text-gray-400 ml-3" size={20} />
                <span className="flex-1 text-white px-2">
                  {paymentMethod === "credit_card"
                    ? "Kredit Kartı"
                    : "Debet Kartı"}
                </span>
              </div>

              {isDropdownOpen && (
                <div className="absolute z-10 bg-[#222] border-2 border-white/20 rounded-lg w-full mt-1">
                  <div
                    onClick={() => {
                      setPaymentMethod("credit_card");
                      setIsDropdownOpen(false);
                    }}
                    className="px-4 py-2 text-white hover:bg-green-400 cursor-pointer border-white/20 rounded-lg"
                  >
                    Kredit Kartı
                  </div>
                  <div
                    onClick={() => {
                      setPaymentMethod("debit_card");
                      setIsDropdownOpen(false);
                    }}
                    className="px-4 py-2 text-white hover:bg-green-400 cursor-pointer border-white/20 rounded-lg"
                  >
                    Debet Kartı
                  </div>
                </div>
              )}
            </div>

            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-2 text-white">
                Kart Nömrəsi
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="w-full p-2 border-2 border-white/20 rounded-3xl bg-[#222] text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-2 text-white">
                Kart Sahibinin Adı
              </label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="AD SOYAD"
                className="w-full p-2 border-2 border-white/20 rounded-3xl bg-[#222] text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="w-full">
                <label className="block text-sm font-medium mb-2 text-white">
                  Bitmə Tarixi
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full p-2 border-2 border-white/20 rounded-3xl bg-[#222] text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium mb-2 text-white">
                  CVV
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className="w-full p-2 border-2 border-white/20 rounded-3xl bg-[#222] text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-br from-green-400 to-green-600 text-gray-900 py-2 px-6 rounded-full shadow-lg hover:bg-gradient-to-bl hover:shadow-2xl transition duration-300"
            >
              Ödənişi Tamamla
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcess;
