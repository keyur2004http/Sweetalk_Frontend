const ChatListSkeleton = () => {
  return (
    <div className="animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4">
          <div className="w-12 h-12 rounded-full bg-gray-200"></div>
          <div className="flex-1">
            <div className="w-24 h-3 bg-gray-200 rounded"></div>
            <div className="w-16 h-3 bg-gray-200 rounded mt-2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};