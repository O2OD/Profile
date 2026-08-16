import React from 'react';
import { FaYoutube, FaTelegram, FaInstagram, FaPhone, FaLink } from 'react-icons/fa';

const getIcon = (platform) => {
  const p = platform.toLowerCase();
  if (p.includes('youtube')) return <FaYoutube />;
  if (p.includes('telegram')) return <FaTelegram />;
  if (p.includes('instagram')) return <FaInstagram />;
  if (p.includes('telefon') || p.includes('tel')) return <FaPhone />;
  return <FaLink />;
};

const Header = ({ profile, socialLinks = [] }) => {
  if (!profile) return null;

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mb-10 border border-gray-100 dark:border-gray-700">
      
      {/* 1. Kengroq va jilodor Banner */}
      <div className="h-40 sm:h-52 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 relative">
         <div className="absolute inset-0 bg-black/10"></div> {/* Yengil qoraytirish effekti */}
      </div>

      {/* 2. MARKAZLASHGAN KONTENT */}
      <div className="px-6 pb-12 flex flex-col items-center text-center -mt-20 sm:-mt-24 relative z-10">
        
        {/* Avatar - Qoq markazda, kattaroq va qalin hoshiyali */}
        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-[6px] border-white dark:border-gray-800 bg-white shadow-2xl mb-5">
          {profile.image ? (
            <img src={profile.image} alt={profile.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center text-gray-500 font-bold text-4xl">
              {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
            </div>
          )}
        </div>

        {/* Ism va Bio - Markazlashtirilgan, zamonaviy shrift qalinligida */}
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
          {profile.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-8">
          {profile.bio}
        </p>

        {/* 3. Tarmoqlar - Katta, zamonaviy va havolali tugmalar */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full">
          {socialLinks.length > 0 ? (
            socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.platform.toLowerCase().includes('telefon') ? `tel:${link.url}` : link.url}
                target={link.platform.toLowerCase().includes('telefon') ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600"
              >
                <span className={
                  link.platform.toLowerCase().includes('youtube') ? 'text-red-500 text-xl' :
                  link.platform.toLowerCase().includes('telegram') ? 'text-blue-500 text-xl' :
                  link.platform.toLowerCase().includes('instagram') ? 'text-pink-600 text-xl' :
                  link.platform.toLowerCase().includes('telefon') ? 'text-green-500 text-xl' : 'text-gray-500 text-xl'
                }>
                  {getIcon(link.platform)}
                </span>
                <span>{link.platform}</span>
              </a>
            ))
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Header;