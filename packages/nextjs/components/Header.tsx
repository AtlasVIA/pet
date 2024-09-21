"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";

const CustomConnectButton = () => (
  <ConnectButton.Custom>
    {({
      account,
      chain,
      openAccountModal,
      openChainModal,
      openConnectModal,
      mounted,
    }) => {
      const ready = mounted;
      const connected = ready && account && chain;

      return (
        <div className="flex items-center">
          {!connected ? (
            <button
              onClick={openConnectModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Connect Wallet
            </button>
          ) : (
            <button
              onClick={openAccountModal}
              className="flex items-center bg-blue-100 px-3 py-2 rounded-md text-blue-800 font-medium hover:bg-blue-200 transition-colors duration-200"
            >
              {account.displayName}
              {account.displayBalance && (
                <span className="ml-2 text-blue-600">
                  ({account.displayBalance})
                </span>
              )}
            </button>
          )}
        </div>
      );
    }}
  </ConnectButton.Custom>
);

export const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Adopt", path: "/adopt" },
    { name: "My Pets", path: "/mypets" },
    { name: "Donations", path: "/donations" },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg transition-transform duration-300 ease-in-out transform group-hover:scale-110">
              <Image src="/blue.webp" alt="Logo" width={64} height={64} className="object-cover" />
            </div>
            <span className="text-2xl font-extrabold text-white tracking-wide">
              Dogachi<span className="text-yellow-300">.Pet</span>
            </span>
          </Link>

          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-base font-medium ${
                  isActive(item.path) ? "text-yellow-300" : "text-white hover:text-yellow-200"
                } transition-colors duration-200`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <CustomConnectButton />
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-500 border-t border-blue-400">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-3 py-2 text-base font-medium ${
                  isActive(item.path)
                    ? "text-yellow-300"
                    : "text-white hover:text-yellow-200"
                } transition-colors duration-200`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 px-3 py-2">
              <CustomConnectButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
