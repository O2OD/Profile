import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSun, FaMoon, FaBorderAll, FaVideo, FaImage, FaMusic } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async'; // SEO UCHUN
import Header from '../components/Header';
import PostCard from '../components/PostCard';

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  const [activeTab, setActiveTab] = useState('all');
  
  // 🌟 YANGI: Paginatsiya (boshida 6 ta post ko'rinadi)
  const [visibleCount, setVisibleCount] = useState(6);

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
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  // Tab o'zgarganda ko'rinadigan postlar sonini qayta 6 taga tushiramiz
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setVisibleCount(6);
  };

  const filteredPosts = posts.filter(post => activeTab === 'all' ? true : post.type === activeTab);
  
  // 🌟 Faqatgina visibleCount gacha bo'lgan postlarni qirqib olamiz
  const visiblePosts = filteredPosts.slice(0, visibleCount);

  if (loading) return <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div></div>;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'}`}>
      
      {/* 🌟 YANGI: SEO META TEGLAR - Telegram yoki Instada ssilka ulashganda chiroyli chiqadi */}
      {profile && (
        <Helmet>
          <title>{profile.name} - Rasmiy Sahifa</title>
          <meta name="description" content={profile.bio} />
          <meta property="og:title" content={`${profile.name} - Rasmiy Profil`} />
          <meta property="og:description" content={profile.bio} />
          <meta property="og:image" content={profile.image} />
          <meta property="og:type" content="website" />
        </Helmet>
      )}

      <div className="absolute top-6 right-6 z-50">
        <button onClick={toggleTheme} className="p-3 rounded-full bg-white/20 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform">
          {darkMode ? <FaSun className="text-yellow-400 text-xl" /> : <FaMoon className="text-gray-600 text-xl" />}
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-screen pt-8">
        
        {profile ? <Header profile={profile} socialLinks={socialLinks} darkMode={darkMode} /> : null}

        <main className="flex-grow w-full">
          <div className="flex flex-wrap justify-center border-t border-gray-300 dark:border-gray-700 mb-8 gap-2">
            <button onClick={() => handleTabChange('all')} className={`flex items-center gap-2 px-4 py-4 font-bold border-t-2 transition-all ${activeTab === 'all' ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'border-transparent text-gray-500'}`}><FaBorderAll /> Barchasi</button>
            <button onClick={() => handleTabChange('video')} className={`flex items-center gap-2 px-4 py-4 font-bold border-t-2 transition-all ${activeTab === 'video' ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'border-transparent text-gray-500'}`}><FaVideo /> Videolar</button>
            <button onClick={() => handleTabChange('image')} className={`flex items-center gap-2 px-4 py-4 font-bold border-t-2 transition-all ${activeTab === 'image' ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'border-transparent text-gray-500'}`}><FaImage /> Rasmlar</button>
            <button onClick={() => handleTabChange('audio')} className={`flex items-center gap-2 px-4 py-4 font-bold border-t-2 transition-all ${activeTab === 'audio' ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'border-transparent text-gray-500'}`}><FaMusic /> Qo'shiqlar</button>
          </div>
          
          {visiblePosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visiblePosts.map((post) => <PostCard key={post.id} post={post} />)}
              </div>
              
              {/* 🌟 YANGI: YANA KO'RSATISH TUGMASI */}
              {visibleCount < filteredPosts.length && (
                <div className="mt-10 flex justify-center">
                  <button 
                    onClick={() => setVisibleCount(prev => prev + 6)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
                  >
                    Yana ko'rsatish ({filteredPosts.length - visibleCount} ta qoldi)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-gray-400">Ushbu bo'limda hozircha hech narsa yo'q.</div>
          )}
        </main>
        <footer className="py-8 text-center text-sm text-gray-500">© {new Date().getFullYear()} Barcha huquqlar himoyalangan.</footer>
      </div>
    </div>
  );
};

export default Home;