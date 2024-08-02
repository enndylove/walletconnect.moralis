import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const projectId = process.env.REACT_APP_API_WALLET_CONNECT

const metadata = {
    name: 'WalletConnect & Moralis APIs',
    description: 'WalletConnect to website by enndy',
    url: 'https://github.com/enndylove/walletconnect.moralis',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum] as const
const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
})

createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    enableOnramp: true // Optional - false as default
})

/**
 * Web3ModalProvider
 *
 * A provider component that wraps the WagmiProvider and QueryClientProvider.
 * It provides the Web3Modal configuration and query client to the application.
 *
 * @param {ReactNode} children - The children components to render.
 * @returns {ReactElement} The Web3ModalProvider component.
 *
 * Example:
 * ```
 * import React from 'react';
 * import ReactDOM from 'react-dom';
 * import { Web3ModalProvider } from './Web3ModalProvider';
 *
 * const App = () => {
 *   return (
 *     <Web3ModalProvider>
 *       <YourApp />
 *     </Web3ModalProvider>
 *   );
 * };
 *
 * ReactDOM.render(<App />, document.getElementById('root'));
 * ```
 */
export function Web3ModalProvider({ children }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}