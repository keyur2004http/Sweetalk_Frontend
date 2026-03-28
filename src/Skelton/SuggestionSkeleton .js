const SuggestionSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="w-24 h-3 bg-gray-200 rounded"></div>
            <div className="w-16 h-3 bg-gray-200 rounded mt-1"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuggestionSkeleton;