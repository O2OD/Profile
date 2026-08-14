import React from 'react';

const Header = ({ profile }) => {
  if (!profile) return null;

  return (
    <header className="flex flex-col items-center justify-center text-center py-10 px-4 mt-8">
      <div className="w-32 h-32 mb-5 rounded-full overflow-hidden border-4 border-white shadow-xl">
        <img 
          src={profile.image} 
          alt={profile.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
        {profile.name}
      </h1>
      <p className="text-gray-600 text-sm md:text-base max-w-md leading-relaxed">
        {profile.bio}
      </p>
    </header>
  );
};

export default Header;