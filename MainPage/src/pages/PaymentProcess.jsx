"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { DollarSign, Calendar } from "lucide-react"
import { useReservation } from "../context/ReservationContext"

const PaymentProcess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { reservation, teamData } = location.state || {}
  const { updateReservation } = useReservation()

  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")

  useEffect(() => {
    if (!reservation) {
      navigate("/stadiums")
    }
  }, [reservation, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically process the payment
    // For now, we'll just simulate a successful payment
    const updatedReservation = { ...reservation, paid: true }
    updateReservation(updatedReservation)
    navigate("/payment-confirmation", {
      state: {
        ...updatedReservation,
        paymentMethod,
      },
    })
  }

  const handleBackToCreateTeam = () => {
    navigate("/create-team", {
      state: {
        ...teamData,
        isReserved: true,
        reservationId: reservation.id,
      },
    })
  }

  if (!reservation) {
    return <div>Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Ödəniş Prosesi</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Rezervasiya Məlumatları</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Calendar className="mr-2" size={18} />
              <span>
                {new Date(reservation.date).toLocaleDateString()} - {reservation.time}
              </span>
            </div>
            <div className="flex items-center mb-4">
              <DollarSign className="mr-2" size={18} />
              <span className="text-xl font-bold">{reservation.price} AZN</span>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Ödəniş Məlumatları</h2>
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Ödəniş Metodu</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="credit_card">Kredit Kartı</option>
                <option value="debit_card">Debet Kartı</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Kart Nömrəsi</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Kart Sahibinin Adı</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="AD SOYAD"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Bitmə Tarixi</label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CVV</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
              >
                Ödənişi Tamamla
              </button>
              {teamData && (
                <button
                  onClick={handleBackToCreateTeam}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
                >
                  Team Yaratmağa Geri Dön
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PaymentProcess

