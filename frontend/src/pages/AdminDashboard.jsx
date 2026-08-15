import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaVideo, FaLock, FaYoutube, FaTrash, FaPlus, FaSignOutAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({ title: '', video_url: '' });
  const [loading, setLoading] = useState(false);

  // YouTube linkdan ID ni ajratib olish va rasmni topish formulasi
  const getYoutubeThumbnail = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
    }
    return null;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Hozircha oddiy himoya. Keyinchalik buni JWT Token'ga o'tkazsak bo'ladi
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert("Parol noto'g'ri!");
    }
  };

  const fetchVideos = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/videos/');
      setVideos(res.data);
    } catch (error) {
      console.error("Xatolik:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchVideos();
  }, [isAuthenticated]);

  const handleAddVideo = async (e) => {
    e.preventDefault();
    const thumbnailUrl = getYoutubeThumbnail(newVideo.video_url);

    if (!thumbnailUrl) {
      alert("Iltimos, to'g'ri YouTube linkini kiriting!");
      return;
    }

    setLoading(true);
    const dataToSend = {
      title: newVideo.title,
      video_url: newVideo.video_url,
      thumbnail: thumbnailUrl, // Rasmni avtomatik o'zimiz yasab jo'natyapmiz!
      is_active: true,
      order: 0
    };

    try {
      await axios.post('http://127.0.0.1:8000/api/videos/', dataToSend);
      setNewVideo({ title: '', video_url: '' }); 
      fetchVideos(); 
    } catch (error) {
      alert("Xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("O'chirib tashlaymizmi?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/videos/${id}/`);
        fetchVideos();
      } catch (error) {
        alert("O'chirishda xatolik.");
      }
    }
  };

  // 1. LOGIN OYNASI
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
        <form onSubmit={handleLogin} className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-white/20">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-500 p-4 rounded-full text-white shadow-lg"><FaLock size={24} /></div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-6">Xush kelibsiz</h2>
          <input 
            type="password" 
            placeholder="Maxfiy parolni kiriting..." 
            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/10 text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 outline-none mb-6 text-center tracking-widest"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/50">
            Tizimga kirish
          </button>
        </form>
      </div>
    );
  }

  // 2. ASOSIY BOSHQARUV PANELI
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-gray-900 px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Boshqaruv Paneli</h1>
            <p className="text-gray-400 text-sm mt-1">Videolarni oson va tez yuklang</p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
            <FaSignOutAlt /> Chiqish
          </button>
        </div>

        <div className="p-8">
          {/* Aqlli Forma */}
          <form onSubmit={handleAddVideo} className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-10 shadow-inner">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaYoutube className="text-red-500 text-xl" /> YouTube video qo'shish
            </h3>
            
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input 
                type="url" 
                required
                placeholder="YouTube linkini tashlang (masalan: https://youtu.be/...)" 
                className="flex-1 px-5 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={newVideo.video_url}
                onChange={(e) => setNewVideo({...newVideo, video_url: e.target.value})}
              />
              <input 
                type="text" 
                required
                placeholder="Video nomi..." 
                className="flex-1 px-5 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={newVideo.title}
                onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? 'Yuklanmoqda...' : <><FaPlus /> Videoni saytga qo'shish</>}
            </button>
          </form>

          {/* Videolar Ro'yxati */}
          <h3 className="font-bold text-gray-800 mb-4">Saytdagi videolar ({videos.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                <div className="aspect-video w-full overflow-hidden relative">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => handleDelete(video.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all"
                      title="O'chirish"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-800 line-clamp-1">{video.title}</h4>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;