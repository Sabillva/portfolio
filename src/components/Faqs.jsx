import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import React, { useState, useRef, useEffect } from "react";

const faqs = [
  {
    question: "How can I use the platform?",
    answer:
      "Simply sign up, search for nearby football fields, and make a reservation.",
  },
  {
    question: "How can I confirm my reservation?",
    answer:
      "After making a reservation, you will receive a confirmation message via email or SMS.",
  },
  {
    question: "How can I make a payment?",
    answer:
      "You can pay online via card or in cash when you arrive at the field.",
  },
  {
    question: "Can I cancel my reservation?",
    answer:
      "Yes, you can cancel your reservation, but cancellation policies may vary depending on the field.",
  },
  {
    question: "How are field prices determined?",
    answer:
      "Prices vary based on the field's location, time slot, and other factors.",
  },
  {
    question: "How can field owners join the platform?",
    answer:
      "Field owners can sign up, add their fields, and offer them to users.",
  },
  {
    question: "What happens to reservations in case of rain or bad weather?",
    answer:
      "In case of bad weather, reservations may be rescheduled or refunded according to the field owner's policies.",
  },
  {
    question: "Do you have a mobile app?",
    answer:
      "Currently, we have a web platform, but a mobile app will be available soon.",
  },
];

function Faqs() {
  return (
    <section id="faqs" className="faqs-section">
      <div className="faqs-container">
        <div className="features-main-layer">
          <div className="features-layer">FAQS</div>
        </div>
        <div className="span-h2">
          <span>Frequently Asked</span>
          <span className="span-other-h2">Questions</span>
        </div>
      </div>
    </section>
  );
}

export default Faqs;
