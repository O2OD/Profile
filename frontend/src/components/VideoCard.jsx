import React from 'react';

const VideoCard = ({ video }) => {
  return (
    <a 
      href={video.video_url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
    >
      <div className="w-full aspect-video overflow-hidden">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-2">
          {video.title}
        </h3>
      </div>
    </a>
  );
};

export default VideoCard;