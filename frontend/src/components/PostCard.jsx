import React, { useState } from 'react';
import { FaYoutube, FaMusic, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const PostCard = ({ post }) => {
  const isVideo = post.type === 'video';
  const isAudio = post.type === 'audio';
  
  // Matnni ochib-yopish uchun state
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300 text-left h-full">
      
      {/* 1. MEDIA QISMI */}
      <div className="relative w-full aspect-video bg-gray-900 overflow-hidden flex-shrink-0">
        
        {isVideo && (
          <a href={post.video_url} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative group">
            <img src={post.thumbnail_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white rounded-full text-red-600 p-1 shadow-lg transform group-hover:scale-110 transition-transform"><FaYoutube className="text-5xl" /></div>
            </div>
            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">Video</span>
          </a>
        )}

        {post.type === 'image' && (
          <div className="w-full h-full relative group">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            <span className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">Rasm</span>
          </div>
        )}

        {isAudio && (
          <div className="w-full h-full relative flex flex-col justify-between bg-gradient-to-tr from-purple-900 to-indigo-800">
            {post.image ? (
               <img src={post.image} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay blur-[2px]" alt="cover" />
            ) : (
               <FaMusic className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/20 text-6xl" />
            )}
            <div className="z-10 mt-auto w-full p-2 bg-black/50 backdrop-blur-sm">
              <audio controls controlsList="nodownload" className="w-full h-10 outline-none rounded">
                <source src={post.audio} type="audio/mpeg" />
              </audio>
            </div>
            <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded z-10">Audio</span>
          </div>
        )}

      </div>
      
      {/* 2. SARLAVHA VA MATN */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-snug">{post.title}</h3>
        {post.description && (
          <div className="mt-2 flex flex-col flex-grow justify-start">
            <p className={`text-sm text-gray-500 dark:text-gray-400 transition-all duration-300 ${expanded ? '' : 'line-clamp-2'}`}>
              {post.description}
            </p>
            {/* Agar matn 70 ta belgidan ko'p bo'lsa, "Batafsil" tugmasi chiqadi */}
            {post.description.length > 70 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-bold mt-2 flex items-center gap-1 w-fit transition-colors"
              >
                {expanded ? 'Qisqartirish' : 'Batafsil'} {expanded ? <FaChevronUp className="text-[10px]"/> : <FaChevronDown className="text-[10px]"/>}
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default PostCard;