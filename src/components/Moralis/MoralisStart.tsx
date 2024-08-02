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