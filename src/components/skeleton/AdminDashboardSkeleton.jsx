import React from "react";

const AdminDashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 text-text-primary animate-pulse">
      {/* Title */}
      <div className="h-8 w-48 bg-gray-300 rounded mb-8"></div>

      {/* Total Users */}
      <div className="rounded-lg shadow-lg shadow-text-secondary p-6 w-full max-w-3xl text-center mb-8">
        <div className="h-4 w-32 bg-gray-300 rounded mx-auto mb-2"></div>
        <div className="h-8 w-24 bg-gray-300 rounded mx-auto"></div>
      </div>

      {/* Companies */}
      <div className="rounded-lg shadow-lg shadow-text-secondary p-6 mb-6 w-full max-w-3xl">
        <div className="h-5 w-32 bg-gray-300 rounded mx-auto mb-4"></div>
        <div className="flex flex-wrap justify-center gap-4">
          {Array(4)
            .fill("")
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      </div>

      {/* Customers */}
      <div className="rounded-lg shadow-lg shadow-text-secondary p-6 mb-6 w-full max-w-3xl">
        <div className="h-5 w-32 bg-gray-300 rounded mx-auto mb-4"></div>
        <div className="flex flex-wrap justify-center gap-4">
          {Array(3)
            .fill("")
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      </div>

      {/* Chats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mt-8">
        <SkeletonChatCard />
        <SkeletonChatCard />
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="rounded-lg shadow-sm shadow-text-secondary p-4 text-center w-40">
    <div className="h-3 w-24 bg-gray-300 rounded mx-auto mb-2"></div>
    <div className="h-6 w-16 bg-gray-300 rounded mx-auto"></div>
  </div>
);

const SkeletonChatCard = () => (
  <div className="rounded-lg shadow-sm shadow-text-secondary p-6 text-center">
    <div className="h-3 w-32 bg-gray-300 rounded mx-auto mb-2"></div>
    <div className="h-6 w-20 bg-gray-300 rounded mx-auto"></div>
  </div>
);

export default AdminDashboardSkeleton;
