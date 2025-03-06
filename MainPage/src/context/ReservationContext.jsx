"use client";

import { createContext, useState, useContext, useEffect } from "react";

const ReservationContext = createContext();

export const useReservation = () => useContext(ReservationContext);

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const storedReservations =
      JSON.parse(localStorage.getItem("reservations")) || [];
    setReservations(storedReservations);
  }, []);

  const addReservation = (reservation) => {
    const updatedReservations = [...reservations, reservation];
    setReservations(updatedReservations);
    localStorage.setItem("reservations", JSON.stringify(updatedReservations));
  };

  const removeReservation = (reservationId) => {
    const updatedReservations = reservations.filter(
      (r) => r.id !== reservationId
    );
    setReservations(updatedReservations);
    localStorage.setItem("reservations", JSON.stringify(updatedReservations));
  };

  const updateReservation = (updatedReservation) => {
    const updatedReservations = reservations.map((r) =>
      r.id === updatedReservation.id ? updatedReservation : r
    );
    setReservations(updatedReservations);
    localStorage.setItem("reservations", JSON.stringify(updatedReservations));
  };

  const isStadiumAvailable = (stadiumId, date, time) => {
    return !reservations.some(
      (r) => r.stadiumId === stadiumId && r.date === date && r.time === time
    );
  };

  const getReservation = (stadiumId, date, time) => {
    return reservations.find(
      (r) => r.stadiumId === stadiumId && r.date === date && r.time === time
    );
  };

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        addReservation,
        removeReservation,
        updateReservation,
        isStadiumAvailable,
        getReservation,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};
