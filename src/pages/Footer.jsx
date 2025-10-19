import React, { useState } from "react";
// ------------------------------------------------------------------
// ⭐️ REACT ICONS REPLACEMENT ⭐️
import {
  FaChevronDown,
  FaTwitter,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";
import { MdMailOutline, MdLocationOn, MdPhone } from "react-icons/md";
// ------------------------------------------------------------------

// Dummy data for links (easier to manage)
const footerLinks = [
  {
    title: "Explore",
    links: [
      { name: "Our Story" },
      { name: "Shop All"},
      { name: "Careers"},
      { name: "Blog"},
    ],
  },
  {
    title: "Customer Help",
    links: [
      { name: "Contact Us"},
      { name: "FAQ" },
      { name: "Shipping & Returns"},
      { name: "Size Guide" },
    ],
  },
  {
    title: "Legal & Trust",
    links: [
      { name: "Terms of Service"  },
      { name: "Privacy Policy" },
      { name: "Accessibility"  },
      { name: "Security" },
    ],
  },
];

// Placeholder for social media icons (now using React Icons)
const SocialIcon = ({ icon: Icon, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-white transition-colors p-1"
  >
    <Icon className="w-6 h-6" />
  </a>
);

// Accordion toggle component for mobile view
const FooterLinkColumn = ({ title, links }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full md:w-auto mb-6 md:mb-0">
      {/* Mobile Accordion Header */}
      <button
        className="md:pointer-events-none flex justify-between w-full items-center py-2 md:py-0 border-b md:border-b-0 border-gray-700 md:text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-bold uppercase tracking-wider text-white">
          {title}
        </h3>
        {/* ChevronDownIcon replaced with FaChevronDown */}
        <FaChevronDown
          className={`w-5 h-5 md:hidden transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Links List - Hidden on mobile unless open */}
      <ul className={`mt-3 md:block ${isOpen ? "block" : "hidden"}`}>
        {links.map((link, index) => (
          <li key={index} className="mb-2">
            <a
              href={link.href}
              className="text-sm text-gray-400 hover:text-indigo-400 transition-colors"
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* === MAIN FOOTER GRID (PILLARS 1-3) === */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 border-b border-gray-700 pb-10 mb-8">
          {/* Pillar 1: Branding and Newsletter CTA (Primary Focus) */}
          <div className="md:col-span-1 mb-6 md:mb-0">
            <h1 className="text-3xl font-extrabold text-white mb-4">
              ShopNow <span className="text-indigo-500">.</span>
            </h1>
            <p className="text-sm mb-6 text-gray-400">
              Quality products, delivered fast. Your satisfaction is our
              priority.
            </p>

            {/* Newsletter CTA */}
            <h4 className="text-base font-semibold text-white mb-3">
              Get 10% Off Your First Order
            </h4>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-3 w-full rounded-l-full bg-white/10 text-white border-0 focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-r-full font-bold transition-colors shrink-0"
              >
                Sign Up
              </button>
            </form>
            <p className="text-xs mt-2 text-gray-500">
              *We value your privacy. Unsubscribe anytime.
            </p>
          </div>

          {/* Pillars 2, 3, 4: Navigation Links (Mobile Accordion) */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
            {footerLinks.map((column, index) => (
              <FooterLinkColumn
                key={index}
                title={column.title}
                links={column.links}
              />
            ))}
          </div>
        </div>

        {/* === BOTTOM BAR (TRUST & COPYRIGHT) === */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          {/* Trust Signals: Payment Logos */}
          <div className="flex gap-4 mb-4 md:mb-0 items-center">
            <span className="font-semibold text-white">Accepted Payments:</span>
            {/* The image URLs for payment logos are kept, as icons8 is a common source */}
            <img
              src="https://img.icons8.com/color/48/000000/visa.png"
              alt="Visa"
              className="h-5"
            />
            <img
              src="https://img.icons8.com/color/48/000000/mastercard.png"
              alt="MasterCard"
              className="h-5"
            />
            <img
              src="https://img.icons8.com/fluency/48/000000/paypal.png"
              alt="PayPal"
              className="h-5"
            />
          </div>

          {/* Social Media Links (Replaced SVGs with React Icons) */}
          <div className="flex gap-4 mb-4 md:mb-0">
            <SocialIcon icon={FaFacebook} href="https://facebook.com" />
            <SocialIcon icon={FaTwitter} href="https://twitter.com" />
            <SocialIcon icon={FaInstagram} href="https://instagram.com" />
          </div>

          {/* Copyright Info */}
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} ShopNow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
