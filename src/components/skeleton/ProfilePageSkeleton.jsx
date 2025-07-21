import React from 'react'

export default function ProfilePageSkeleton() {
      const skeletonRows = Array.from({ length: 5 }); // Number of skeleton rows/cards

  return (
  <>
     <table className="hidden md:table w-full border-collapse animate-pulse">
            <thead>
              <tr className="bg-header-background text-left text-sm text-text-secondary">
                <th className="p-2">Company Name</th>
                <th className="p-2">Contact Email</th>
                <th className="p-2">Registration Date</th>
                <th className="p-2">Logo</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {skeletonRows.map((_, i) => (
                <tr key={i} className="border-t border-input">
                  <td className="p-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="p-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </td>
                  <td className="p-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="p-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  </td>
                  <td className="p-2">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="p-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Skeleton for Cards (Mobile) */}
          <div className="md:hidden space-y-4 animate-pulse">
            {skeletonRows.map((_, i) => (
              <div
                key={i}
                className="border border-input rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        
  </>
  )
}
