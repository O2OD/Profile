import React from 'react';
import { FaYoutube } from 'react-icons/fa';

const PostCard = ({ post }) => {
  const isVideo = post.type === 'video';

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300 text-left">
      
      {/* 1. Rasm va YouTube piktogrammasi qismi */}
      <div className="relative w-full aspect-video bg-gray-900 overflow-hidden">
        {isVideo ? (
          <a href={post.video_url} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative group">
            <img 
              src={post.thumbnail_url} 
              alt={post.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
            {/* O'RTADAGI QIP-QIZIL YOUTUBE BELGISI */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full text-red-600 p-1 shadow-lg transform group-hover:scale-110 transition-transform">
                <FaYoutube className="text-5xl" />
              </div>
            </div>
            {/* PASTDAGI BURCHAKDAGI "VIDEO" YORLIG'I */}
            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">
              Video
            </span>
          </a>
        ) : (
          <div className="w-full h-full relative group">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
            <span className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
              Rasm
            </span>
          </div>
        )}
      </div>
      
      {/* 2. Sarlavha va matn qismi */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 leading-snug">
          {post.title}
        </h3>
        {post.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
            {post.description}
          </p>
        )}
      </div>

    </div>
  );
};

export default PostCard;