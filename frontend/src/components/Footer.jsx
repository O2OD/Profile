import React from 'react';
import { FaYoutube, FaTelegram, FaInstagram, FaFacebook, FaLink } from 'react-icons/fa';

const getIcon = (platform) => {
  switch (platform) {
    case 'youtube': return <FaYoutube className="w-7 h-7" />;
    case 'telegram': return <FaTelegram className="w-7 h-7" />;
    case 'instagram': return <FaInstagram className="w-7 h-7" />;
    case 'facebook': return <FaFacebook className="w-7 h-7" />;
    default: return <FaLink className="w-7 h-7" />;
  }
};

const Footer = ({ socialLinks }) => {
  return (
    <footer className="mt-12 mb-8 pb-6 border-t border-gray-200 pt-8">
      <div className="flex justify-center gap-6">
        {socialLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-600 hover:-translate-y-1 transition-all duration-300"
          >
            {getIcon(link.platform)}
          </a>
        ))}
      </div>
      <p className="text-center text-gray-400 text-sm mt-6">
        © {new Date().getFullYear()} Barcha huquqlar himoyalangan.
      </p>
    </footer>
  );
};

export default Footer;