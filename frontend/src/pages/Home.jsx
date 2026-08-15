import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSun, FaMoon } from 'react-icons/fa';
import Header from '../components/Header';
import PostCard from '../components/PostCard';
import Footer from '../components/Footer';

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, linksRes, postsRes] = await Promise.allSettled([
          axios.get('http://127.0.0.1:8000/api/profile/'),
          axios.get('http://127.0.0.1:8000/api/social-links/'),
          axios.get('http://127.0.0.1:8000/api/posts/')
        ]);
        if (profileRes.status === 'fulfilled' && profileRes.value.data.length > 0) setProfile(profileRes.value.data[0]);
        if (linksRes.status === 'fulfilled') setSocialLinks(linksRes.value.data);
        if (postsRes.status === 'fulfilled') setPosts(postsRes.value.data);
      } catch (error) {
        console.error("Xatolik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      <div className="absolute top-6 right-6 z-50">
        <button onClick={toggleTheme} className="p-3 rounded-full bg-white/10 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700">
          {darkMode ? <FaSun className="text-yellow-400 text-xl" /> : <FaMoon className="text-gray-600 text-xl" />}
        </button>
      </div>

      {/* SAYT KENGAYTIRILDI (max-w-7xl) TO'LIQ YOUTUBE DEK BO'LISHI UCHUN */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-screen">
        
        {profile ? <Header profile={profile} darkMode={darkMode} /> : null}
        
        <main className="mt-10 flex-grow w-full">
         
          <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
            <h2 className="text-2xl font-bold tracking-tight">So'nggi postlar va videolar</h2>
          </div>
          
          {posts.length > 0 ? (
            /* ASOSIY GRID: Kompyuterda 3 ta, Katta ekranda 4 ta yonma-yon turadi */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              Hali hech qanday post yuklanmagan.
            </div>
          )}
        </main>

        <Footer socialLinks={socialLinks} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default Home;