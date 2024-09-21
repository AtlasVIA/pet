"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname } from "next/navigation";

/**
 * Custom RainbowKit Connect Button with improved styling
 */
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
              className="px-4 py-2 bg-indigo-700 text-white rounded-lg font-semibold hover:bg-indigo-800 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Connect Wallet
            </button>
          ) : (
            <button
              onClick={openAccountModal}
              className="flex items-center bg-white px-3 py-2 rounded-lg text-indigo-700 font-semibold hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {account.displayName}
              {account.displayBalance && (
                <span className="ml-2 text-gray-600">
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

/**
 * Site header
 */
export const Header = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? "text-indigo-700 font-bold" : "text-gray-600 hover:text-indigo-700";
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Project Name */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-700">
              <Image src="/blue.webp" alt="Logo" width={40} height={40} className="object-cover" />
            </div>
            <span className="text-2xl font-extrabold text-indigo-700">Dogachi.Pet</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className={`${isActive('/')} transition-colors duration-200`}>
              Home
            </Link>
            <Link href="/adopt" className={`${isActive('/adopt')} transition-colors duration-200`}>
              Adopt
            </Link>
            <Link href="/mypets" className={`${isActive('/mypets')} transition-colors duration-200`}>
              My Pets
            </Link>
            <Link href="/donations" className={`${isActive('/donations')} transition-colors duration-200`}>
              Donations
            </Link>
          </nav>

          {/* Connect Button */}
          <CustomConnectButton />
        </div>
      </div>
    </header>
  );
};
