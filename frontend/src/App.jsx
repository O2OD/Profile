import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import VideoCard from './components/VideoCard';
import Footer from './components/Footer';

function App() {
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Django API'dan ma'lumotlarni tortib olish
        const profileRes = await axios.get('http://127.0.0.1:8000/api/profile/');
        const videosRes = await axios.get('http://127.0.0.1:8000/api/videos/');
        const socialRes = await axios.get('http://127.0.0.1:8000/api/social-links/');

        if (profileRes.data.length > 0) {
          setProfile(profileRes.data[0]);
        }
        setVideos(videosRes.data);
        setSocialLinks(socialRes.data);
      } catch (error) {
        console.error("Server bilan ulanishda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Ma'lumot kelgunicha aylanib turadigan chiroyli Loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-3xl mx-auto px-4 flex flex-col min-h-screen">
        <Header profile={profile} />
        
        <main className="mt-8 flex-grow">
          <h2 className="text-xl font-bold text-gray-900 mb-6 px-2">
            Barcha videolar
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </main>

        <Footer socialLinks={socialLinks} />
      </div>
    </div>
  );
}

export default App;