"use client";

import { useState } from "react";
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
      {/* Hamburger button for small screens */}
      <button
        className="fixed top-4 left-4 z-50 p-3 bg-primary text-[#222] rounded-md lg:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#222] shadow-lg transition-all duration-300 ease-in-out z-40 ${
          isOpen ? "w-64" : "w-0 lg:w-64"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-center h-16 bg-primary"></div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="py-4">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="flex items-center px-6 py-3 text-gray-300 hover:bg-primary hover:text-white transition-all duration-200 ease-in-out"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-4">{item.name}</span>
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
