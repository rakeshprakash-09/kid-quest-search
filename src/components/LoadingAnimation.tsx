import React from 'react';

export const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="flex gap-2">
        <div className="w-4 h-4 bg-fun-pink rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-4 h-4 bg-fun-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-4 h-4 bg-fun-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        <div className="w-4 h-4 bg-fun-green rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></div>
        <div className="w-4 h-4 bg-fun-yellow rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
      </div>
      <p className="mt-4 text-lg font-medium text-foreground animate-pulse">
        Searching for awesome facts... 🔍
      </p>
    </div>
  );
};