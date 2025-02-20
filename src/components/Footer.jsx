import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
  AnimatePresence,
  keyframes,
} from "framer-motion";
import React, { useState, useRef, useEffect } from "react";

const navItems = [
  {
    href: "",
    label: "Home",
  },
  {
    href: "",
    label: "About",
  },
  {
    href: "",
    label: "Features",
  },
  {
    href: "",
    label: "Matches",
  },
  {
    href: "",
    label: "FAQs",
  },
  {
    href: "",
    label: "Contact",
  },
];

function Footer() {
  return (
    <section className="footer-section">
      <div className="footer-container">
        <div>
          Making football field bookings easy and digital in Azerbaijan!
        </div>
        <p>Find and book football fields easily. Your game, your rules!</p>

        <button>Get for free</button>
        <nav>
          {navItems.map(({ href, label }) => (
            <a href={href} key={label}>
              {label}
            </a>
          ))}
        </nav>
        <p>Copyright &copy; StadTap &bull; All rights reserved</p>
      </div>
    </section>
  );
}

export default Footer;
