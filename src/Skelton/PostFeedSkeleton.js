const PostFeedSkeleton = () => {
  return (
    <div className="border-b p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="w-32 h-4 bg-gray-200 rounded"></div>
      </div>

      <div className="w-full h-80 bg-gray-200 rounded"></div>

      <div className="flex gap-4 mt-3">
        <div className="w-6 h-6 bg-gray-200 rounded"></div>
        <div className="w-6 h-6 bg-gray-200 rounded"></div>
        <div className="w-6 h-6 bg-gray-200 rounded"></div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="w-48 h-4 bg-gray-200 rounded"></div>
        <div className="w-64 h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default PostFeedSkeleton;