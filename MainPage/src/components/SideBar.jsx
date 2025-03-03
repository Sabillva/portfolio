"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  StickerIcon as Stadium,
  Users,
  UserPlus,
  Swords,
  PlusSquare,
  MessageSquare,
  CalendarCheck,
  CreditCard,
  User,
  Menu,
  X,
} from "lucide-react";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // İlk yükləmədə də çağırırıq

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { name: "Stadiums", icon: <Stadium size={20} />, path: "/stadiums" },
    { name: "Teams", icon: <Users size={20} />, path: "/teams" },
    { name: "Create Team", icon: <UserPlus size={20} />, path: "/create-team" },
    { name: "Matches", icon: <Swords size={20} />, path: "/matches" },
    {
      name: "Create Matches",
      icon: <PlusSquare size={20} />,
      path: "/create-matches",
    },
    { name: "Chat", icon: <MessageSquare size={20} />, path: "/chat" },
    {
      name: "Reservation Process",
      icon: <CalendarCheck size={20} />,
      path: "/reservation",
    },
    {
      name: "Payment Process",
      icon: <CreditCard size={20} />,
      path: "/payment",
    },
    { name: "User Profile", icon: <User size={20} />, path: "/profile" },
  ];

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-md lg:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out z-40 ${
          isOpen ? "w-64" : "w-0"
        } lg:w-64`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 bg-primary">
            <h1 className="text-white text-xl font-bold">Football Fields</h1>
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="py-4">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
                    onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default SideBar;
