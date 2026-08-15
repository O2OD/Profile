import React from 'react';

const Header = ({ profile, darkMode }) => {
  if (!profile) return null;

  return (
    <header className="flex flex-col items-center justify-center text-center py-10 px-4 mt-8">
      <div className="w-32 h-32 mb-5 rounded-full overflow-hidden border-4 border-blue-500 shadow-2xl">
        <img 
          src={profile.image} 
          alt={profile.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <h1 className={`text-3xl font-extrabold mb-3 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {profile.name}
      </h1>
      <p className={`text-sm md:text-base max-w-md leading-relaxed transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {profile.bio}
      </p>
    </header>
  );
};

export default Header;