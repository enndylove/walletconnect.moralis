import { useEffect, useState } from "react";
// @ts-ignore
import style from '../styles/Preloader.module.scss'
// @ts-ignore
import backgroundImage from './../dist/pictures/preloader__background.webp'
// @ts-ignore
import PreloaderLogo from './../dist/pictures/logos/preloader__logo.png'

/**
 * A preloader component that displays a loading animation with a background image and a logo.
 *
 * @returns {JSX.Element} A JSX element representing the preloader component.
 *
 * @example
 * import React from 'react';
 * import Preloader from './Preloader';
 *
 * const App = () => {
 *   return (
 *     <div>
 *       <Preloader />
 *     </div>
 *   );
 * };
 */
const Preloader = () => {
    const [isLoading, setIsLoading] = useState(true)

    /**
     * A useEffect hook that sets the isLoading state to false after a 100ms delay.
     *
     * This is used to simulate a loading animation.
     */
    useEffect(() => {
        setTimeout(() => setIsLoading(false), 100)
    }, [])

    return (
        <div className={`${style.loader} fixed left-0 top-0 w-full h-full ${!isLoading ? style.loader__load : ''}`}>
            <img className={"relative left-0 top-0 w-full h-full " + style.loader__background}
                 src={backgroundImage}
                 loading={"lazy"}
                 alt="background"
            />
            <img className={"absolute " + style.loader__logo} src={PreloaderLogo} alt="logo"/>
        </div>
    );
};

export default Preloader;