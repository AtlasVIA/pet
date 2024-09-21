import React from "react";
import Image from "next/image";

export const AppPreview: React.FC = () => {
  return (
    <div className="mt-8 md:mt-0 md:ml-8">
      <Image src="/aap-ux.png" alt="App Preview" width={270} height={740} className="rounded-xl shadow-lg" />
    </div>
  );
};
