export default function Loading() {
  return (
    <div className="w-full flex flex-col gap-6 animate-pulse p-4">
      <div className="h-10 bg-gray-200/60 rounded-xl w-1/3 mb-4 backdrop-blur-sm"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white/40 border border-gray-100 rounded-3xl p-6 h-80 flex flex-col justify-between shadow-sm backdrop-blur-md">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="h-6 bg-gray-200/80 rounded w-2/3"></div>
                <div className="h-6 bg-gray-200/80 rounded-full w-16"></div>
              </div>
              <div className="h-4 bg-gray-200/60 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200/60 rounded w-4/5 mb-6"></div>
            </div>
            
            <div>
              <div className="h-2 bg-gray-200/80 rounded-full w-full mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="h-5 bg-gray-200/80 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200/80 rounded-full w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
