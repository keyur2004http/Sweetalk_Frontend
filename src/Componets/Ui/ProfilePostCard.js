import React from 'react';

const ProfilePostCard = ({ post }) => {
  const URL = "http://localhost:8080";

  return (
    <div className="relative group cursor-pointer overflow-hidden rounded-md bg-gray-200 aspect-square">
      <img
        src={`${URL}${post.imageUrl}`} 
        alt="Post"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="flex gap-4 text-white font-bold">
        </div>
      </div>
    </div>
  );
};

export default ProfilePostCard;