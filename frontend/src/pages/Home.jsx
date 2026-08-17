import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSun, FaMoon, FaBorderAll, FaVideo, FaImage, FaMusic, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import PostCard from '../components/PostCard';

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  const [activeTab, setActiveTab] = useState('all');
  
  // 🌟 YANGI: SAHIFALASH (PAGINATION) MANTIQI
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Bitta sahifada 12 ta post chiqadi

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

  // Tab o'zgarganda sahifani yana 1-ga qaytaramiz
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Postlarni filtrlash va qirqib olish (Pagination)
  const filteredPosts = posts.filter(post => activeTab === 'all' ? true : post.type === activeTab);
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visiblePosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);

  // Sahifa o'zgarganda tepaga silliq ko'tarilish
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div></div>;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${darkMode ? 'bg-[#0f172a] text-white' : 'bg-[#f8f9fa] text-gray-900'}`}>
      
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

      {/* Tungi rejim */}
      <div className="absolute top-6 right-6 z-50">
        <button onClick={toggleTheme} className="p-3.5 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-lg shadow-lg border border-white/50 dark:border-gray-700/50 hover:scale-110 transition-transform">
          {darkMode ? <FaSun className="text-yellow-400 text-xl" /> : <FaMoon className="text-gray-700 text-xl" />}
        </button>
      </div>

      {/* 🌟 YANGILANGAN: KENGAYTIRILGAN EKRAN (max-w-[1400px]) */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col min-h-screen pt-12 pb-10">
        
        {profile ? <Header profile={profile} socialLinks={socialLinks} darkMode={darkMode} /> : null}

        <main className="flex-grow w-full mt-6">
          
          {/* Menyular */}
          <div className="flex flex-wrap justify-center mb-12 gap-2 sm:gap-4">
            <button onClick={() => handleTabChange('all')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === 'all' ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-lg' : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'}`}><FaBorderAll /> Barchasi</button>
            <button onClick={() => handleTabChange('video')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === 'video' ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'}`}><FaVideo /> Videolar</button>
            <button onClick={() => handleTabChange('image')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === 'image' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'}`}><FaImage /> Rasmlar</button>
            <button onClick={() => handleTabChange('audio')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === 'audio' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'}`}><FaMusic /> Qo'shiqlar</button>
          </div>
          
          {/* 🌟 YANGILANGAN GRID: Noutbukda 4 ta, Planshetda 2 ta, Telefonda 1 ta */}
          {visiblePosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {visiblePosts.map((post) => <PostCard key={post.id} post={post} />)}
              </div>
              
              {/* 🌟 YANGI: KLASSIK RAQAMLI PAGINATION (Sahifalash) */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-2 sm:gap-3">
                  
                  {/* Orqaga tugmasi */}
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-200 dark:bg-[#1e293b] text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold"
                  >
                    <FaChevronLeft className="text-sm" />
                  </button>

                  {/* Raqamlar */}
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    // Katta raqamlarda faqat boshini, oxirini va o'rtasini ko'rsatish (Siz tashlagan rasmdagidek)
                    if (
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-12 h-12 flex items-center justify-center rounded-xl font-black text-lg transition-all duration-300 ${
                            currentPage === page
                              ? 'bg-[#4ade80] text-gray-900 shadow-lg shadow-green-500/20' // Faol yashil rang
                              : 'bg-gray-200 dark:bg-[#1e293b] text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="text-gray-500 font-bold px-1">...</span>;
                    }
                    return null;
                  })}

                  {/* Oldinga tugmasi */}
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-200 dark:bg-[#1e293b] text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold"
                  >
                    <FaChevronRight className="text-sm" />
                  </button>
                  
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24 text-gray-400 bg-white/50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-200 dark:border-gray-700 max-w-3xl mx-auto">
              <span className="text-5xl block mb-4">📭</span>
              <p className="font-bold text-lg">Ushbu bo'limda hozircha hech narsa yo'q.</p>
            </div>
          )}
        </main>
        
        <footer className="mt-20 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm font-bold text-gray-400">
          © {new Date().getFullYear()} Barcha huquqlar himoyalangan.
        </footer>
      </div>
    </div>
  );
};

export default Home;