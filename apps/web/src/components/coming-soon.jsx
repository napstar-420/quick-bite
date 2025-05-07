export function ComingSoon() {
  return (
    <div className="text-center max-w-md">
      {/* Illustration */}
      <div className="mb-6 flex justify-center">
        <div className="relative h-40 w-80">
          {/* Drink illustration */}
          <div className="absolute left-1/4 transform -translate-x-1/2">
            <div className="w-12 h-24 bg-gradient-to-b from-green-300 to-yellow-300 rounded-md relative">
              <div className="absolute top-0 w-full h-2 bg-green-400 rounded-t-md"></div>
              <div className="absolute top-2 right-0 w-2 h-2 bg-green-200 rounded-full"></div>
              <div className="absolute top-6 right-1 w-1 h-1 bg-green-200 rounded-full"></div>
              <div className="absolute top-10 right-2 w-1.5 h-1.5 bg-yellow-200 rounded-full"></div>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-green-500"></div>
            </div>
          </div>

          {/* Food container illustration */}
          <div className="absolute right-1/4 transform translate-x-1/2">
            <div className="w-32 h-20 bg-red-400 rounded-md relative">
              <div className="absolute -bottom-1 left-0 w-full h-4 bg-red-500 rounded-b-md"></div>
              <div className="absolute top-1/3 left-1/4 w-12 h-2 bg-red-300 rounded-md"></div>
              <div className="absolute bottom-6 right-2 w-2 h-2 bg-red-300 rounded-full"></div>
              <div className="absolute bottom-8 right-6 w-1 h-1 bg-red-300 rounded-full"></div>
              <div className="absolute bottom-4 right-10 w-1.5 h-1.5 bg-red-300 rounded-full"></div>
            </div>
          </div>

          {/* Dots */}
          <div className="absolute bottom-0 right-1/3 w-1.5 h-1.5 bg-red-400 rounded-full"></div>
          <div className="absolute bottom-4 right-1/4 w-1 h-1 bg-red-400 rounded-full"></div>
          <div className="absolute bottom-2 right-1/5 w-2 h-2 bg-red-400 rounded-full"></div>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4">We&apos;re coming soon</h1>
      <p className="text-gray-600">
        We are always expanding our coverage area. Please check back in the
        future.
      </p>
    </div>
  );
}
