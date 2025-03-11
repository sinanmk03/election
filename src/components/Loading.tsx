import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex items-center justify-center space-x-2">
        <div className="relative flex space-x-2">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"
              style={{
                animationDelay: `${index * 0.2}s`,
                animationDuration: "1s",
                transformOrigin: "center",
                animationTimingFunction: "ease-in-out",
                animationName: "pulse",
              }}
            ></div>
          ))}
        </div>
        <style>{`
            @keyframes pulse {
              0%,
              100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.5);
              }
            }
          `}</style>
      </div>
    </div>
  );
};

export default Loading;
