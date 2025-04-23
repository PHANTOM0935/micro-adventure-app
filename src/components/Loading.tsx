
import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-treasure-dark flex flex-col items-center justify-center">
      {/* Logo/Icon */}
      <div className="mb-8 relative">
        <div className="w-24 h-24 rounded-full bg-treasure-DEFAULT flex items-center justify-center z-10 relative animate-float">
          <div className="text-4xl">🗝️</div>
        </div>
        <div className="absolute inset-0 bg-treasure-DEFAULT rounded-full animate-pulse-ring opacity-50"></div>
      </div>
      
      {/* Loading text */}
      <h1 className="text-3xl font-bold text-white mb-2">GeoTreasure Hunt</h1>
      <p className="text-white/70 mb-8">Adventure awaits outside</p>
      
      {/* Loading animation */}
      <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-treasure-DEFAULT animate-[pulse_1.5s_ease-in-out_infinite] origin-left"></div>
      </div>
      
      {/* Loading message */}
      <p className="text-white/50 mt-6 text-sm">Scanning for nearby treasures...</p>
    </div>
  );
};

export default Loading;
