const PostSkeleton = () => (
  <div className="grid grid-cols-3 gap-[1px] sm:gap-2">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="aspect-[4/5] bg-gray-200 rounded-md animate-pulse" />
    ))}
  </div>
);
export default PostSkeleton;