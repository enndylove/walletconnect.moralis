# WalletConnect & Moralis APIs <img src="https://img.shields.io/static/v1?label=🌀 TypeScript&message=Web3 🔑&color=ffffff" />

This project contains a React component called `Console` that displays data from WalletConnect and Moralis APIs with a typing effect. The component allows users to view wallet information, NFTs, and transactions by entering an Ethereum address.

## Features

- **Typing Effect**: Text is displayed with a typing effect using a custom hook.
- **Data Display**: Displays wallet information, NFTs, and transactions.
- **Search Functionality**: Users can search for data by entering an Ethereum address.
- **Interactive UI**: Includes clickable file tabs and buttons for interacting with the console.

![](https://i.ibb.co/WyBPTqz/300x300-logo.png)

## Getting Started

### Prerequisites

###### To run this project, you need to have Node.js installed on your machine. You can download and install Node.js from [here](https://nodejs.org/en).

### Installation
1. Clone the repository:
```shell
git clone https://github.com/enndylove/walletconnect.moralis.git
```
2. Navigate to the project directory:
```shell
cd walletconnect.moralis
```
3. Install the required dependencies:
```shell
npm install
```

## Usage
### Starting Moralis API `/src/components/Moralis/MoralisStart.tsx`
###### Set REACT_APP_API_MORALIS=YOUR_API_KEY in .env file(in root directory)
###### * check .env.example

To starting Moralis API - use component:
```typescript
import Moralis from 'moralis';
import { useEffect } from 'react';

/**
 * Starts the Moralis API.
 *
 * This component is responsible for initializing the Moralis API with the provided API key.
 * It uses the `useEffect` hook to ensure that the API is started only once, when the component mounts.
 *
 * @example
 * import React from 'react';
 * import MoralisStart from './MoralisStart';
 *
 * const App = () => {
 *   return (
 *     <div>
 *       <MoralisStart />
 *       // Rest of the app components
 *     </div>
 *   );
 * };
 *
 * @returns {null} This component does not render any UI elements.
 */
const MoralisStart: React.FC = () => {
    useEffect(() => {
        /**
         * Starts the Moralis API with the provided API key.
         *
         * @async
         * @throws {Error} If the REACT_APP_API_MORALIS environment variable is not defined.
         */
        const startMoralis = async () => {
            try {
                if (!process.env.REACT_APP_API_MORALIS) {
                    throw new Error('REACT_APP_API_MORALIS is not defined');
                }

                await Moralis.start({
                    apiKey: process.env.REACT_APP_API_MORALIS,
                });

                console.info('Moralis started successfully');
            } catch (error) {
                console.log('Error starting Moralis');
            }
        };

        startMoralis();
        return () => {};
    }, []);

    return null;
};

export default MoralisStart;
```

### WalletConnect: Web3ModalProvider `/src/components/WalletConnect/Web3ModalProvider.tsx`
###### Set REACT_APP_API_WALLET_CONNECT=YOUR_PROJECT_ID in .env file(in root directory)
###### * check .env.example
````typescript jsx
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
````

### Hook getAddress.tsx(Web3) in `/src/hooks/getAddress.tsx`
```typescript jsx
import { Web3Modal } from "@web3modal/wagmi";
import { cookieStorage } from "@wagmi/core";

/**
 * Retrieves the user's Ethereum address and chain ID.
 *
 * This function checks if the Ethereum object is present in the window object,
 * and if so, attempts to enable the Ethereum provider to access the user's account.
 * If the user grants access, the function returns an object containing the user's
 * Ethereum address and chain ID. If the user denies access or the Ethereum object
 * is not found, the function returns an empty object.
 *
 * @example
 * const addressInfo = await getAddress();
 * console.log(addressInfo.address); // "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
 * console.log(addressInfo.chainId); // 1
 *
 * @returns {Promise<object>} An object containing the user's Ethereum address and chain ID.
 */
const getAddress = async (): Promise<object> => {
    let _web3: Web3Modal;
    const ethereum = (window as any).ethereum;
    let userAddress = '';

    if (ethereum) {
        if (!ethereum.selectedAddress) {
            try {
                await ethereum.enable();
            } catch (error) {
                console.error("User denied account access", error);
                return;
            }
        }
        userAddress = ethereum.selectedAddress;
        cookieStorage.setItem("address", ethereum.selectedAddress);
        console.log("Wallet is connecting", ethereum.selectedAddress);
    } else {
        console.error("Ethereum object not found in window");
    }

    return {
        address: userAddress,
        chainId: ethereum.chainId
    };
};

export default getAddress;
```

### Hook useData.tsx(Moralis API) in  `/src/hooks/useData.tsx`
```typescript jsx
import { useState, useEffect } from 'react';
// @ts-ignore
import getAddress from './getAddress.tsx';
// @ts-ignore
import MoralisStart from "../components/Moralis/MoralisStart.tsx";
import Moralis from 'moralis';

interface TypesLocal {
    chain: string;
    address: string;
}

/**
 * Hook to fetch and return user data from Moralis API.
 *
 * @param {string} [address] - Optional address to fetch data for.
 * @param {string} [chainId] - Optional chain ID to fetch data for.
 * @returns {object} - An object containing the user's data, including NFTs, balance, wallet, and transactions.
 *
 * @example
 * const data = useData('0x1234567890abcdef', '0x1');
 * console.log(data);
 * // Output:
 * // {
 * //   nft: [...],
 * //   balance: 10.5,
 * //   wallet: {...},
 * //   transactions: [...]
 * // }
 */
const useData = (address?: string, chainId?: string) => {
    const [data, setData] = useState<{
        nft?: any;
        balance?: number;
        wallet?: any;
        transactions?: any;
    }>({});

    MoralisStart({});
    useEffect(() => {
        const walletRegex = /^0x[a-fA-F0-9]{40}$/;

        async function asyncGA() {
            const object = await getAddress();

            const localInfo: TypesLocal = {
                chain: object?.chainId || "0x1",
                address: object?.address || undefined,
            };

            const searchInfo: TypesLocal = {
                chain: chainId || "0x1",
                address: address || undefined,
            };

            const fetchAddress = async (info: TypesLocal, addressWallet: string) => {
                const balance = await Moralis.EvmApi.balance.getNativeBalance(info);
                const nft = await Moralis.EvmApi.nft.getWalletNFTs(info);
                const wallet = await Moralis.EvmApi.wallets.getWalletActiveChains({address: addressWallet});
                const transactions = await Moralis.EvmApi.transaction.getWalletTransactions({
                    "chain": "0x1",
                    "order": "DESC",
                    "address": addressWallet
                });
                const balanceWei = balance.raw.balance;
                setData({
                    nft: nft.raw,
                    balance: balanceWei / Math.pow(10, 18),
                    wallet: wallet.raw,
                    transactions: transactions.raw.result,
                });
            };

            if (!address && !chainId && object.address && object.chainId && walletRegex.test(object.address)) {
                fetchAddress(localInfo, object.address);
            } else if (address && chainId && walletRegex.test(address)) {
                fetchAddress(searchInfo, address);
            }
        }

        asyncGA();
    }, [address, chainId]);

    return data;
};

export default useData;
```
### Usage example
```typescript
const { nft: resultNFTs, wallet: resultWallet, balance, transactions } = useData();

console.log(
    resultNFTs,
    resultWallet,
    balance,
    transactions
)
```

### Regex for checking the wallet address
```typescript
const walletRegex = /^0x[a-fA-F0-9]{40}$/;

// example
if(walletRegex.test(YOUR_ADDRESS)) {
    fetchAddress({
        chain: YOUR_CHAIN || "0x1",
        address: YOUR_ADDRESS || undefined,
    }, YOUR_ADDRESS);
}
```

### Basic requests for information using the Moralis API
```typescript
const balance = await Moralis.EvmApi.balance.getNativeBalance({
    chain: YOUR_CHAIN || "0x1",
    address: YOUR_ADDRESS || undefined,
});
const nft = await Moralis.EvmApi.nft.getWalletNFTs({
    chain: YOUR_CHAIN || "0x1",
    address: YOUR_ADDRESS || undefined,
});
const wallet = await Moralis.EvmApi.wallets.getWalletActiveChains({
    address: YOUR_ADDRESS || undefined
});
const transactions = await Moralis.EvmApi.transaction.getWalletTransactions({
    "chain": YOUR_CHAIN || "0x1",
    "order": YOUR_ORDER || "DESC",
    "address": YOUR_ADDRESS || undefined
});

// balance format
const balanceWei = balance.raw.balance;
const ethFormatBalance = balanceWei / Math.pow(10, 18)
```

### A custom hook that displays text with a typing effect
```typescript
/**
 * Hook to display text with a typing effect.
 *
 * @param {string} text - The text to display.
 * @param {number} interval - The interval between each character display.
 * @returns {string} The displayed text.
 */
const useTextInterval = (text: string, interval: number) => {
        const [result, setResult] = useState('');
        const [index, setIndex] = useState(0);
        const intervalRef = useRef<NodeJS.Timeout | null>(null);

        useEffect(() => {
            if (index >= text.length) return;

            intervalRef.current = setInterval(() => {
                setResult(prevResult => prevResult + text[index]);
                setIndex(prevIndex => prevIndex + 1);
            }, interval);

            return () => {
                if (intervalRef.current) clearInterval(intervalRef.current);
            };
        }, [index, text, interval]);

        return result;
    };
```

### UI console banner in `/src/components/ui/Banner.tsx` file
```typescript jsx
// @ts-ignore
import style from '../../styles/Console.module.scss'

/**
 * Renders a console banner component.
 *
 * @returns {JSX.Element} The console banner component.
 *
 * @example
 * import Banner from './Banner';
 *
 * const App = () => {
 *   return (
 *     <div>
 *       <Banner />
 *     </div>
 *   );
 * };
 */
const Banner = () => {
    return (
        <pre className={`${style.console__banner}`}>
      {`
                                    $$\\
                                    $$ |
 $$$$$$\\  $$$$$$$\\  $$$$$$$\\   $$$$$$$ |$$\\   $$\\
$$  __$$\\ $$  __$$\\ $$  __$$\\ $$  __$$ |$$ |  $$ |
$$$$$$$$ |$$ |  $$ |$$ |  $$ |$$ /  $$ |$$ |  $$ |
$$   ____|$$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |
\\$$$$$$$\\ $$ |  $$ |$$ |  $$ |\\$$$$$$$ |\\$$$$$$$ |
 \\_______|\\__|  \\__|\\__|  \\__| \\_______| \\____$$ |
                                        $$\\   $$ |
                                        \\$$$$$$  |
                                         \\______/
`}
    </pre>
    );
};

export default Banner;
```
```scss
// # File "/src/styles/Console.module.scss"

.console__banner {
    font-family: 'Lucida Console', sans-serif !important;
    font-size: 10px;
    color: #FFFFFF;

    @media screen and (max-width: 385px) {
      font-size: 8px;
    }
  }
```

## License
#### This project is licensed under the [MIT License](https://github.com/enndylove/walletconnect.moralis/blob/main/LICENSE).

### Delicious coffee to you friends ☕
