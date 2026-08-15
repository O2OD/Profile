import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaLock, FaYoutube, FaImage, FaTrash, FaSignOutAlt, FaPen, FaUser, FaLink, FaTelegram, FaInstagram } from 'react-icons/fa';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Menyu (Tab) holati: 'posts', 'profile', 'social'
  const [activeTab, setActiveTab] = useState('posts');
  
  const [posts, setPosts] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [profile, setProfile] = useState({ id: null, name: '', bio: '', image: null });
  const [profileImageFile, setProfileImageFile] = useState(null); // Yangi rasm yuklash uchun

  const [loading, setLoading] = useState(false);
  
  const [newPost, setNewPost] = useState({ type: 'video', title: '', description: '', video_url: '', image: null });
  const [newLink, setNewLink] = useState({ platform: 'Telegram', url: '' });

  const getYoutubeThumbnail = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg` : null;
  };

  const fetchAllData = async () => {
    try {
      const [postsRes, profileRes, linksRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/posts/'),
        axios.get('http://127.0.0.1:8000/api/profile/'),
        axios.get('http://127.0.0.1:8000/api/social-links/')
      ]);
      setPosts(postsRes.data);
      if (profileRes.data.length > 0) setProfile(profileRes.data[0]);
      setSocialLinks(linksRes.data);
    } catch (error) {
      console.error("Ma'lumotlarni tortishda xatolik:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchAllData();
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') setIsAuthenticated(true);
    else alert("Parol noto'g'ri!");
  };

  // 1. POST (VIDEO/RASM) QO'SHISH
  const handleAddPost = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('type', newPost.type);
    formData.append('title', newPost.title);
    if (newPost.description) formData.append('description', newPost.description);

    if (newPost.type === 'video') {
      const thumb = getYoutubeThumbnail(newPost.video_url);
      if (!thumb) { alert("Noto'g'ri YouTube link!"); setLoading(false); return; }
      formData.append('video_url', newPost.video_url);
      formData.append('thumbnail_url', thumb);
    } else {
      if (!newPost.image) { alert("Rasmni yuklang!"); setLoading(false); return; }
      formData.append('image', newPost.image);
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/posts/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setNewPost({ type: 'video', title: '', description: '', video_url: '', image: null }); 
      fetchAllData(); 
    } catch (error) { alert("Xatolik yuz berdi."); } 
    finally { setLoading(false); }
  };

  // 2. PROFILNI SAQLASH
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('bio', profile.bio);
    if (profileImageFile) formData.append('image', profileImageFile);

    try {
      if (profile.id) {
        // Agar profil oldin yaratilgan bo'lsa - tahrirlaymiz
        await axios.put(`http://127.0.0.1:8000/api/profile/${profile.id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        // Yangi yaratsak
        await axios.post('http://127.0.0.1:8000/api/profile/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      alert("Profil muvaffaqiyatli saqlandi!");
      fetchAllData();
    } catch (error) { alert("Profil saqlashda xatolik!"); } 
    finally { setLoading(false); }
  };

  // 3. TARMOQ QO'SHISH
  const handleAddLink = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/social-links/', newLink);
      setNewLink({ ...newLink, url: '' }); // Ssilkani tozalaymiz
      fetchAllData();
    } catch (error) { alert("Xatolik"); }
  };

  const handleDelete = async (type, id) => {
    if(window.confirm("O'chirib tashlaymizmi?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/${type}/${id}/`);
        fetchAllData();
      } catch (error) { alert("O'chirishda xatolik."); }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <form onSubmit={handleLogin} className="bg-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-white/10">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Xush kelibsiz</h2>
          <input type="password" placeholder="Parol..." className="w-full px-4 py-3 rounded-xl bg-white/20 text-white outline-none mb-6 text-center placeholder-gray-300 focus:ring-2 focus:ring-blue-400" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 transition-colors text-white py-3 rounded-xl font-bold shadow-lg">Kirish</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        <div className="bg-gray-900 px-8 py-6 flex flex-col md:flex-row justify-between items-center text-white gap-4">
          <h1 className="text-2xl font-bold">Boshqaruv Paneli</h1>
          <button onClick={() => setIsAuthenticated(false)} className="hover:text-blue-400 flex items-center gap-2 transition-colors">
            <FaSignOutAlt /> Chiqish
          </button>
        </div>

        {/* MENYU (TABS) */}
        <div className="flex border-b border-gray-200">
          <button onClick={() => setActiveTab('posts')} className={`flex-1 py-4 font-bold text-center transition-colors ${activeTab === 'posts' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
            Videolar / Postlar
          </button>
          <button onClick={() => setActiveTab('profile')} className={`flex-1 py-4 font-bold text-center transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
            Profil Sozlamalari
          </button>
          <button onClick={() => setActiveTab('social')} className={`flex-1 py-4 font-bold text-center transition-colors ${activeTab === 'social' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
            Tarmoqlar (Ssilkalar)
          </button>
        </div>

        <div className="p-8">
          
          {/* TAB 1: POSTLAR */}
          {activeTab === 'posts' && (
            <div className="animate-fade-in">
              <form onSubmit={handleAddPost} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-10 shadow-inner">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <button type="button" onClick={() => setNewPost({...newPost, type: 'video'})} className={`flex-1 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${newPost.type === 'video' ? 'bg-red-500 text-white shadow-md' : 'bg-white border text-gray-600'}`}>
                    <FaYoutube className="text-xl" /> YouTube Video
                  </button>
                  <button type="button" onClick={() => setNewPost({...newPost, type: 'image'})} className={`flex-1 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${newPost.type === 'image' ? 'bg-blue-500 text-white shadow-md' : 'bg-white border text-gray-600'}`}>
                    <FaImage className="text-xl" /> Rasm / Status
                  </button>
                </div>
                <div className="space-y-4">
                  <input type="text" required placeholder="Sarlavha..." className="w-full px-5 py-3 rounded-xl border outline-none" value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} />
                  <textarea placeholder="Batafsil matn (ixtiyoriy)..." rows="3" className="w-full px-5 py-3 rounded-xl border outline-none resize-none" value={newPost.description} onChange={(e) => setNewPost({...newPost, description: e.target.value})} />
                  {newPost.type === 'video' ? (
                    <input type="url" required placeholder="YouTube link (masalan: https://youtu.be/...)" className="w-full px-5 py-3 rounded-xl border outline-none" value={newPost.video_url} onChange={(e) => setNewPost({...newPost, video_url: e.target.value})} />
                  ) : (
                    <input type="file" required accept="image/*" className="w-full px-5 py-3 rounded-xl border bg-white" onChange={(e) => setNewPost({...newPost, image: e.target.files[0]})} />
                  )}
                </div>
                <button type="submit" disabled={loading} className="mt-6 w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-50">
                  <FaPen /> {loading ? 'Yuklanmoqda...' : 'Saytga Joylash'}
                </button>
              </form>

              <h3 className="font-bold text-gray-800 mb-6 text-xl">Mavjud postlar ({posts.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <div key={post.id} className="relative bg-white border rounded-2xl overflow-hidden shadow-sm group">
                    <div className="aspect-video w-full bg-gray-100 relative">
                      <img src={post.type === 'video' ? post.thumbnail_url : post.image} className="w-full h-full object-cover" alt="post" />
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-bold text-blue-600 mb-1">{post.type === 'video' ? 'VIDEO' : 'STATUS'}</p>
                      <h4 className="font-bold text-gray-900 line-clamp-1">{post.title}</h4>
                    </div>
                    <button onClick={() => handleDelete('posts', post.id)} className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"><FaTrash /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PROFIL */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="animate-fade-in bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-inner">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FaUser className="text-blue-500" /> Profilni tahrirlash</h2>
              
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                {/* Rasm qismi */}
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-gray-400">
                    {profileImageFile ? (
                      <img src={URL.createObjectURL(profileImageFile)} className="w-full h-full object-cover" alt="yangi" />
                    ) : profile.image ? (
                      <img src={profile.image} className="w-full h-full object-cover" alt="profil" />
                    ) : (
                      <FaUser className="text-4xl" />
                    )}
                  </div>
                  <label className="cursor-pointer bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-200 transition-colors">
                    Rasm tanlash
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setProfileImageFile(e.target.files[0])} />
                  </label>
                </div>

                {/* Ism va Bio */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Ism / Nik</label>
                    <input type="text" required className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} placeholder="Ismingizni kiriting" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">O'zingiz haqingizda (Bio)</label>
                    <textarea required className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows="3" value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} placeholder="Qisqacha ma'lumot..." />
                  </div>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg transition-colors">
                {loading ? 'Saqlanmoqda...' : 'Profilni Saqlash'}
              </button>
            </form>
          )}

          {/* TAB 3: TARMOQLAR */}
          {activeTab === 'social' && (
            <div className="animate-fade-in">
              <form onSubmit={handleAddLink} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-inner mb-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FaLink className="text-green-500" /> Yangi tarmoq qo'shish</h2>
                <div className="flex flex-col md:flex-row gap-4">
                  <select 
                    className="px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-green-500 font-bold text-gray-700"
                    value={newLink.platform}
                    onChange={(e) => setNewLink({...newLink, platform: e.target.value})}
                  >
                    <option value="Telegram">Telegram</option>
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Facebook">Facebook</option>
                  </select>
                  <input 
                    type="url" required placeholder="Profil ssilkasi (https://...)" 
                    className="flex-1 px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-green-500"
                    value={newLink.url} onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                  />
                  <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-colors">
                    Qo'shish
                  </button>
                </div>
              </form>

              <h3 className="font-bold text-gray-800 mb-4 text-lg">Mavjud ssilkalar</h3>
              <div className="space-y-3">
                {socialLinks.map(link => (
                  <div key={link.id} className="flex justify-between items-center bg-white border p-4 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      {link.platform.toLowerCase() === 'telegram' && <FaTelegram className="text-blue-500 text-2xl" />}
                      {link.platform.toLowerCase() === 'instagram' && <FaInstagram className="text-pink-500 text-2xl" />}
                      {link.platform.toLowerCase() === 'youtube' && <FaYoutube className="text-red-500 text-2xl" />}
                      <div>
                        <p className="font-bold text-gray-800">{link.platform}</p>
                        <a href={link.url} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline">{link.url}</a>
                      </div>
                    </div>
                    <button onClick={() => handleDelete('social-links', link.id)} className="text-red-500 hover:bg-red-50 p-3 rounded-lg transition-colors">
                      <FaTrash />
                    </button>
                  </div>
                ))}
                {socialLinks.length === 0 && <p className="text-gray-400">Hali hech qanday tarmoq kiritilmagan.</p>}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;