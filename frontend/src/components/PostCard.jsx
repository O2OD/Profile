import React, { useState } from 'react';
import { FaYoutube, FaMusic, FaChevronDown, FaChevronUp, FaDownload, FaPlay, FaSpinner } from 'react-icons/fa';

const PostCard = ({ post }) => {
  const isVideo = post.type === 'video';
  const isAudio = post.type === 'audio';
  const isImage = post.type === 'image';
  
  const [expanded, setExpanded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // 🌟 Yuklanish holatini kuzatish

  // 🌟 YANGI: MAJBURIY YUKLAB OLISH (FORCE DOWNLOAD) MANTIQI
  const handleForceDownload = async (audioUrl, title) => {
    setIsDownloading(true);
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      // Faylga postning sarlavhasini avtomat nom qilib beramiz
      link.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`; 
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Yuklab olishda xatolik yuz berdi:", error);
      // Agar qandaydir xatolik bo'lsa, zaxira sifatida eski usulda ochadi
      window.open(audioUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/50 dark:border-gray-700/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left h-full group">
      
      {/* 1. MEDIA QISMI */}
      <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-900 overflow-hidden flex-shrink-0">
        
        {/* VIDEO */}
        {isVideo && (
          <a href={post.video_url} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative">
            <img src={post.thumbnail_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-red-600/90 backdrop-blur-sm text-white p-4 rounded-2xl shadow-xl transform group-hover:scale-110 transition-transform">
                <FaPlay className="text-3xl ml-1" />
              </div>
            </div>
            <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-black px-3 py-1.5 rounded-full tracking-widest">Video</span>
          </a>
        )}

        {/* RASM */}
        {isImage && (
          <div className="w-full h-full relative">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <span className="absolute top-4 right-4 bg-blue-600/80 backdrop-blur-md text-white text-[10px] uppercase font-black px-3 py-1.5 rounded-full tracking-widest">Rasm</span>
          </div>
        )}

        {/* AUDIO */}
        {isAudio && (
          <div className="w-full h-full relative flex flex-col justify-end bg-gradient-to-br from-indigo-900 via-purple-900 to-black group-hover:scale-105 transition-transform duration-700">
            {post.image ? (
               <img src={post.image} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" alt="cover" />
            ) : (
               <FaMusic className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/10 text-7xl" />
            )}
            
            <div className="relative z-10 w-full p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              <audio controls controlsList="nodownload" className="w-full h-11 outline-none rounded-xl opacity-90">
                <source src={post.audio} type="audio/mpeg" />
              </audio>
            </div>
            <span className="absolute top-4 right-4 bg-purple-600/80 backdrop-blur-md text-white text-[10px] uppercase font-black px-3 py-1.5 rounded-full z-10 tracking-widest">Audio</span>
          </div>
        )}

      </div>
      
      {/* 2. MATN VA YUKLAB OLISH TUGMASI */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-xl text-gray-900 dark:text-white leading-tight mb-2">{post.title}</h3>
        
        {post.description && (
          <div className="mt-1 flex flex-col flex-grow justify-start">
            <p className={`text-sm text-gray-500 dark:text-gray-400 leading-relaxed transition-all duration-300 ${expanded ? '' : 'line-clamp-2'}`}>
              {post.description}
            </p>
            {post.description.length > 70 && (
              <button onClick={() => setExpanded(!expanded)} className="text-blue-600 dark:text-blue-400 text-sm font-bold mt-2 flex items-center gap-1 w-fit hover:underline">
                {expanded ? 'Qisqartirish' : 'Batafsil'} {expanded ? <FaChevronUp className="text-[10px]"/> : <FaChevronDown className="text-[10px]"/>}
              </button>
            )}
          </div>
        )}

        {/* 🌟 YANGILANGAN: KUTISH EFFEKTI BILAN ISHLAYDIGAN TUGMA */}
        {isAudio && post.audio && (
          <button 
            onClick={() => handleForceDownload(post.audio, post.title)}
            disabled={isDownloading}
            className={`mt-5 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold transition-all ${isDownloading ? 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-wait' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-gray-900 dark:text-white active:scale-[0.98]'}`}
          >
            {isDownloading ? (
              <>
                <FaSpinner className="animate-spin text-purple-600 dark:text-purple-400 text-lg" /> 
                Yuklanmoqda...
              </>
            ) : (
              <>
                <FaDownload className="text-purple-600 dark:text-purple-400 text-lg" /> 
                Yuklab olish
              </>
            )}
          </button>
        )}
      </div>

    </div>
  );
};

export default PostCard;