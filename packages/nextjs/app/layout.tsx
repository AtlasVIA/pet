import "@rainbow-me/rainbowkit/styles.css";
import { ReactNode } from "react";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";
import "~~/styles/globals.css";

export const metadata = getMetadata({
  title: "Dogachi.Pet",
  description: "",
});

const HomePageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default HomePageLayout;
