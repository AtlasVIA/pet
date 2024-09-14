// Footer.tsx
import React from "react";

export const Footer = () => {
  return (
    <footer className="py-4 w-full text-center">
      <div className="text-sm text-gray-600">
        Made with <span className="text-red-500">❤️</span> by{" "}
        <a href="https://x.com/Atlas_VIA" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          Atlas
        </a>{" "}
        · Powered by{" "}
        <a href="https://vialabs.io" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          VIA Labs
        </a>
      </div>
    </footer>
  );
};
