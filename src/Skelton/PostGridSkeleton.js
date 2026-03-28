const PostGridSkeleton = () => {
  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-4">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className="aspect-square bg-gray-200 animate-pulse rounded"
        />
      ))}
    </div>
  );
};

export default PostGridSkeleton;