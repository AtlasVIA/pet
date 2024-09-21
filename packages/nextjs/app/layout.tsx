import { Analytics } from "@vercel/analytics/react"
import { ReactNode } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";
import { Inter, Nunito } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const nunito = Nunito({ subsets: ['latin'] });

export const metadata = getMetadata({
  title: "Dogachi.Pet",
  description: "",
});

const HomePageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html suppressHydrationWarning className={`${inter.className} ${nunito.className}`}>
      <body>
        <ThemeProvider enableSystem>
          <ScaffoldEthAppWithProviders>
            {children}
            <Analytics />
          </ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default HomePageLayout;
