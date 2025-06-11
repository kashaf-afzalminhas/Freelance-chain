// frontend/context/ThirdwebProvider.jsx
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Mumbai } from "@thirdweb-dev/chains";

export default function ThirdwebProviderWrapper({ children }) {
  return (
    <ThirdwebProvider
      activeChain={Mumbai}
      clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID}
      supportedChains={[Mumbai]}
    >
      {children}
    </ThirdwebProvider>
  );
}