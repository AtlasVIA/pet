"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

/**
 * Custom RainbowKit Connect Button with improved mobile styling
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
        <div className="flex items-center space-x-2">
          {!connected ? (
            <button
              onClick={openConnectModal}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Account Info */}
              <button
                onClick={openAccountModal}
                className="flex items-center bg-gray-200 px-2 sm:px-3 py-1 rounded-lg text-black font-semibold hover:bg-gray-300 truncate max-w-[100px] sm:max-w-none"
              >
                {account?.displayName}
                {account?.displayBalance && (
                  <span className="ml-1 sm:ml-2 text-black truncate">
                    ({account?.displayBalance})
                  </span>
                )}
              </button>
            </div>
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
  return (
    <div className="sticky top-0 navbar bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 min-h-0 flex-shrink-0 justify-between z-20 shadow-lg px-6 py-3">
      {/* Logo with Project Name */}
      <div className="navbar-start flex items-center space-x-2">
        {/* 50% Larger Circular Logo */}
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
          <Image src="/blue.webp" alt="Logo" width={60} height={60} className="object-cover" />
        </div>

        {/* Mobile text "AAP", desktop text "Adopt A Pet" */}
        <Link href="/" className="text-2xl sm:text-3xl font-extrabold text-purple-700">
          <span className="block sm:hidden">BD</span>
          <span className="hidden sm:block">Blue's Dog</span>
        </Link>
      </div>

      {/* Right Side with Connect Button */}
      <div className="navbar-end flex justify-end items-center space-x-2 sm:space-x-4">
        <CustomConnectButton />
      </div>
    </div>
  );
};
