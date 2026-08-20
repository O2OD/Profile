import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaYoutube, FaImage, FaMusic, FaTrash, FaSignOutAlt, FaPen, FaUser, FaCheckCircle, FaExclamationTriangle, FaLock } from 'react-icons/fa';

// 🌟 JWT Tokenni har bir so'rovga avtomat qo'shish (Xavfsizlik)
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  error => Promise.reject(error)
);

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Login uchun state-lar
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState('posts');
  
  const [posts, setPosts] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [profile, setProfile] = useState({ id: null, name: '', bio: '', image: null });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [newPost, setNewPost] = useState({ type: 'video', title: '', description: '', video_url: '', image: null, audio: null });
  const [newLink, setNewLink] = useState({ platform: 'Telegram', url: '' });

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: null, id: null });

  // Dastur boshlanganda tokenni tekshirish
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
      fetchAllData();
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => { setToast({ show: false, message: '', type: 'success' }); }, 3000);
  };

  const getYoutubeThumbnail = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg` : null;
  };

  const fetchAllData = async () => {
    try {
      const [postsRes, profileRes, linksRes] = await Promise.all([
        axios.get('https://profile-2nsm.onrender.com/api/posts/'),
        axios.get('https://profile-2nsm.onrender.com/api/profile/'),
        axios.get('https://profile-2nsm.onrender.com/api/social-links/')
      ]);
      setPosts(postsRes.data);
      if (profileRes.data.length > 0) setProfile(profileRes.data[0]);
      setSocialLinks(linksRes.data);
    } catch (error) { 
      console.error("Ma'lumotlarni yuklashda xatolik:", error); 
    }
  };

  useEffect(() => { 
    if (isAuthenticated) fetchAllData(); 
  }, [isAuthenticated]);

  // 🌟 JWT ORQALI TIZIMGA KIRISH
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://profile-2nsm.onrender.com/api/token/', {
        username: username,
        password: password
      });
      localStorage.setItem('access_token', response.data.access);
      setIsAuthenticated(true);
      showToast("Tizimga muvaffaqiyatli kirdingiz!", "success");
      fetchAllData();
    } catch (error) {
      showToast("Login yoki parol noto'g'ri!", "error");
    }
  };

  // TIZIMDAN CHIQISH
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('type', newPost.type);
    formData.append('title', newPost.title);
    if (newPost.description) formData.append('description', newPost.description);

    if (newPost.type === 'video') {
      const thumb = getYoutubeThumbnail(newPost.video_url);
      if (!thumb) { showToast("Noto'g'ri YouTube link!", "error"); setLoading(false); return; }
      formData.append('video_url', newPost.video_url);
      formData.append('thumbnail_url', thumb);
    } 
    else if (newPost.type === 'image') {
      if (!newPost.image) { showToast("Rasmni yuklang!", "error"); setLoading(false); return; }
      formData.append('image', newPost.image);
    }
    else if (newPost.type === 'audio') {
      if (!newPost.audio) { showToast("Audio faylni (MP3) yuklang!", "error"); setLoading(false); return; }
      formData.append('audio', newPost.audio);
      if (newPost.image) formData.append('image', newPost.image); 
    }

    try {
      await axios.post('https://profile-2nsm.onrender.com/api/posts/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setNewPost({ type: 'video', title: '', description: '', video_url: '', image: null, audio: null }); 
      fetchAllData(); 
      showToast("Saytga muvaffaqiyatli joylandi!", "success");
    } catch (error) { 
      showToast("Xatolik yuz berdi. Huquqingiz yo'q bo'lishi mumkin.", "error"); 
    } 
    finally { setLoading(false); }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('bio', profile.bio);
    if (profileImageFile) formData.append('image', profileImageFile);

    try {
      if (profile.id) await axios.put(`https://profile-2nsm.onrender.com/api/profile/${profile.id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await axios.post('https://profile-2nsm.onrender.com/api/profile/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      fetchAllData();
      showToast("Profil muvaffaqiyatli saqlandi!", "success");
    } catch (error) { 
      showToast("Profil saqlashda xato!", "error"); 
    } 
    finally { setLoading(false); }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    try { 
      await axios.post('https://profile-2nsm.onrender.com/api/social-links/', newLink); 
      setNewLink({ ...newLink, url: '' }); 
      fetchAllData(); 
      showToast("Tarmoq qo'shildi!", "success");
    } catch (error) { 
      showToast("Xatolik yuz berdi!", "error"); 
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.id || !deleteModal.type) return;
    try { 
      await axios.delete(`https://profile-2nsm.onrender.com/api/${deleteModal.type}/${deleteModal.id}/`); 
      fetchAllData(); 
      showToast("Muvaffaqiyatli o'chirildi!", "success");
    } catch (error) { 
      showToast("O'chirishda xatolik.", "error"); 
    } finally {
      setDeleteModal({ isOpen: false, type: null, id: null });
    }
  };

  // 1. KIRMANGANDA KO'RINADIGAN EKRAN (LOGIN)
  if (!isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 relative overflow-hidden">
      
      {/* Orqa fon effektlari */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Bildirishnoma */}
      {toast.show && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-[100]">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl font-bold text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {toast.type === 'success' ? <FaCheckCircle className="text-2xl" /> : <FaExclamationTriangle className="text-2xl" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Login formasi */}
      <form onSubmit={handleLogin} className="relative bg-white/10 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/10 z-10">
        <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3 hover:rotate-0 transition-transform">
          <FaLock className="text-white text-3xl" />
        </div>
        <h2 className="text-3xl font-black text-white text-center mb-2 tracking-tight">Maxfiy Hudud</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Faqat sayt administratori kirishi mumkin</p>
        
        <div className="relative mb-4">
          <input 
            type="text" 
            required
            placeholder="Login (Username)..." 
            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all text-center text-lg placeholder-gray-500" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>

        <div className="relative mb-8">
          <input 
            type="password" 
            required
            placeholder="Parolni kiriting..." 
            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all text-center text-lg tracking-widest placeholder-gray-500" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        
        <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
          Tizimga Kirish
        </button>
      </form>
    </div>
  );

  // 2. KIRGANDAN KEYINGI EKRAN (ADMIN DASHBOARD)
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 relative">
      
      {/* Bildirishnoma (Toast) */}
      {toast.show && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-[100]">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl font-bold text-white transition-all ${toast.type === 'success' ? 'bg-green-500 shadow-green-500/30' : 'bg-red-500 shadow-red-500/30'}`}>
            {toast.type === 'success' ? <FaCheckCircle className="text-2xl" /> : <FaExclamationTriangle className="text-2xl" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* O'chirishni tasdiqlash oynasi (Modal) */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <FaExclamationTriangle className="text-4xl text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Tasdiqlaysizmi?</h3>
            <p className="text-gray-500 mb-8">Bu ma'lumotni o'chirgach, uni qayta tiklab bo'lmaydi.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteModal({ isOpen: false, type: null, id: null })} className="flex-1 py-3.5 rounded-2xl font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                Bekor qilish
              </button>
              <button onClick={confirmDelete} className="flex-1 py-3.5 rounded-2xl font-bold bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg shadow-red-500/30">
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mt-12">
        
        {/* Yuqori Panel */}
        <div className="bg-gray-900 px-8 py-6 flex flex-col md:flex-row justify-between items-center text-white gap-4">
          <h1 className="text-2xl font-bold">Boshqaruv Paneli</h1>
          <button onClick={handleLogout} className="hover:text-blue-400 flex items-center gap-2 transition-colors">
            <FaSignOutAlt /> Chiqish
          </button>
        </div>

        {/* Tab Menyular */}
        <div className="flex border-b border-gray-200">
          <button onClick={() => setActiveTab('posts')} className={`flex-1 py-4 font-bold text-center transition-colors ${activeTab === 'posts' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Postlar</button>
          <button onClick={() => setActiveTab('profile')} className={`flex-1 py-4 font-bold text-center transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Profil</button>
          <button onClick={() => setActiveTab('social')} className={`flex-1 py-4 font-bold text-center transition-colors ${activeTab === 'social' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Tarmoqlar</button>
        </div>

        <div className="p-8">
          
          {/* TAB 1: POSTLAR */}
          {activeTab === 'posts' && (
            <div className="animate-fade-in">
              <form onSubmit={handleAddPost} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-10 shadow-inner">
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button type="button" onClick={() => setNewPost({...newPost, type: 'video'})} className={`flex-1 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${newPost.type === 'video' ? 'bg-red-500 text-white shadow-lg' : 'bg-white border text-gray-600'}`}><FaYoutube /> Video</button>
                  <button type="button" onClick={() => setNewPost({...newPost, type: 'image'})} className={`flex-1 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${newPost.type === 'image' ? 'bg-blue-500 text-white shadow-lg' : 'bg-white border text-gray-600'}`}><FaImage /> Rasm</button>
                  <button type="button" onClick={() => setNewPost({...newPost, type: 'audio'})} className={`flex-1 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${newPost.type === 'audio' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white border text-gray-600'}`}><FaMusic /> Audio</button>
                </div>
                
                <div className="space-y-4">
                  <input type="text" required placeholder="Sarlavha (Qo'shiq / Video nomi)..." className="w-full px-5 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-400" value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} />
                  <textarea placeholder="Batafsil matn (ixtiyoriy)..." rows="3" className="w-full px-5 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-400 resize-none" value={newPost.description} onChange={(e) => setNewPost({...newPost, description: e.target.value})} />
                  
                  {newPost.type === 'video' && <input type="url" required placeholder="YouTube link (masalan: https://youtu.be/...)" className="w-full px-5 py-3 rounded-xl border focus:ring-2 focus:ring-red-400 outline-none" value={newPost.video_url} onChange={(e) => setNewPost({...newPost, video_url: e.target.value})} />}
                  {newPost.type === 'image' && <input type="file" required accept="image/*" className="w-full px-5 py-3 rounded-xl border bg-white" onChange={(e) => setNewPost({...newPost, image: e.target.files[0]})} />}
                  {newPost.type === 'audio' && (
                    <>
                      <label className="block text-sm font-bold text-gray-700">Audio fayl (MP3):</label>
                      <input type="file" required accept="audio/*" className="w-full px-5 py-3 rounded-xl border bg-white" onChange={(e) => setNewPost({...newPost, audio: e.target.files[0]})} />
                      <label className="block text-sm font-bold text-gray-700 mt-2">Muqova rasmi (Ixtiyoriy):</label>
                      <input type="file" accept="image/*" className="w-full px-5 py-3 rounded-xl border bg-white" onChange={(e) => setNewPost({...newPost, image: e.target.files[0]})} />
                    </>
                  )}
                </div>
                <button type="submit" disabled={loading} className="mt-6 w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-50 transition-colors"><FaPen /> {loading ? 'Yuklanmoqda...' : 'Saytga Joylash'}</button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <div key={post.id} className="relative bg-white border rounded-2xl overflow-hidden shadow-sm group hover:shadow-md transition-all">
                    <div className="p-4">
                      <p className={`text-xs font-bold mb-1 ${post.type==='video'?'text-red-500':post.type==='audio'?'text-purple-600':'text-blue-500'}`}>{post.type.toUpperCase()}</p>
                      <h4 className="font-bold line-clamp-1 text-gray-800">{post.title}</h4>
                    </div>
                    <button onClick={() => setDeleteModal({ isOpen: true, type: 'posts', id: post.id })} className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"><FaTrash /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PROFIL */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="bg-gray-50 p-6 rounded-2xl border shadow-inner">
               <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow overflow-hidden flex items-center justify-center">
                    {profileImageFile ? <img src={URL.createObjectURL(profileImageFile)} className="w-full h-full object-cover" alt="yangi" /> : profile.image ? <img src={profile.image.startsWith('http') ? profile.image : `https://profile-2nsm.onrender.com${profile.image}`} className="w-full h-full object-cover" alt="profil" /> : <FaUser className="text-4xl text-gray-400" />}
                  </div>
                  <label className="cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors">Rasm tanlash<input type="file" accept="image/*" className="hidden" onChange={(e) => setProfileImageFile(e.target.files[0])} /></label>
                </div>
                <div className="flex-1 space-y-4">
                  <input type="text" required className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} placeholder="Ism / Nik" />
                  <textarea required className="w-full px-4 py-3 rounded-xl border resize-none focus:ring-2 focus:ring-blue-400 outline-none" rows="3" value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} placeholder="O'zingiz haqingizda (Bio)" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-colors">{loading ? 'Saqlanmoqda...' : 'Profilni Saqlash'}</button>
            </form>
          )}

          {/* TAB 3: TARMOQLAR */}
          {activeTab === 'social' && (
            <div className="animate-fade-in">
              <form onSubmit={handleAddLink} className="bg-gray-50 p-6 rounded-2xl border mb-8 flex flex-col md:flex-row gap-4">
                <select className="px-4 py-3 rounded-xl border font-bold text-gray-700 outline-none focus:ring-2 focus:ring-green-400" value={newLink.platform} onChange={(e) => setNewLink({...newLink, platform: e.target.value})}>
                  <option value="Telegram">Telegram</option>
                  <option value="Instagram">Instagram</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Telefon">Telefon</option>
                </select>
                <input type="text" required placeholder="Ssilka yoki Telefon raqam..." className="flex-1 px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-green-400" value={newLink.url} onChange={(e) => setNewLink({...newLink, url: e.target.value})} />
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-colors">Qo'shish</button>
              </form>
              <div className="space-y-3">
                {socialLinks.map(link => (
                  <div key={link.id} className="flex justify-between items-center bg-white border p-4 rounded-xl shadow-sm hover:shadow-md transition-all">
                    <p className="font-bold">{link.platform}: <span className="font-normal text-blue-500">{link.url}</span></p>
                    <button onClick={() => setDeleteModal({ isOpen: true, type: 'social-links', id: link.id })} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><FaTrash /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;