const ProfileCardSkeleton = () => {
  return (
    <div className="p-6 animate-pulse">
      
      <div className="flex items-center gap-6">
        
        {/* profile image */}
        <div className="w-24 h-24 bg-gray-200 rounded-full"></div>

        {/* stats */}
        <div className="flex gap-6">
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
        </div>

      </div>

      {/* bio */}
      <div className="mt-4 space-y-2">
        <div className="w-40 h-4 bg-gray-200 rounded"></div>
        <div className="w-64 h-4 bg-gray-200 rounded"></div>
      </div>

    </div>
  );
};

export default ProfileCardSkeleton;