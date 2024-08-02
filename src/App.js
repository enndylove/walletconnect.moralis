import { lazy, useState, useEffect } from 'react';

import './styles/Main.scss'

import Preloader from "./components/Preloader.tsx"

import {Web3ModalProvider} from "./components/WalletConnect/Web3ModalProvider.tsx";

const Header = lazy(() => import("./components/Header.tsx"));

const Background = lazy(() => import("./components/Background.tsx"));

const Footer = lazy(() => import("./components/Footer.tsx"));

const Console = lazy(() => import("./components/Console.tsx"));

/**
 * Main application component.
 *
 * Handles loading state and renders all main components.
 *
 * @example
 * <App />
 */
function App() {
    /**
     * Flag indicating whether the application is loading.
     */
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Effect hook to simulate a loading delay.
     *
     * Sets `isLoading` to `false` after 1.5 seconds.
     */
    useEffect(() => {
        setTimeout(() => setIsLoading(false), 1500)
    }, [])

    return (
        <div className={`fixed left-0 top-0 w-full h-full`}>
            <Background />

            <Header />

            <Web3ModalProvider />

            <Console />

            <Footer />

            { isLoading ? <Preloader /> : '' }
        </div>
    );
}

export default App;