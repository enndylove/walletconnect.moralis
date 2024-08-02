// @ts-ignore
import React from 'react';
// @ts-ignore
import backgroundImage from './../dist/pictures/preloader__background.webp';
// @ts-ignore
import videoBackground from './../dist/videos/background__main.mov';
// @ts-ignore
import style from './../styles/Background.module.scss';

/**
 * Background component that displays a video background and a fallback image.
 *
 * @example
 * ```jsx
 * import React from 'react';
 * import Background from './Background';
 *
 * const App = () => {
 *   return (
 *     <div>
 *       <Background />
 *     </div>
 *   );
 * };
 * ```
 *
 * @returns {React.ReactElement} A React element representing the background component.
 */
const Background: React.FC = () => {
    return (
        <div className="absolute left-0 top-0 w-full h-full" style={{ zIndex: -100 }}>
            <video className={style.video} autoPlay muted loop>
                <source src={videoBackground} type="video/mp4" />
            </video>
            <img
                className={`relative left-0 top-0 w-full h-full ${style.loader__background}`}
                src={backgroundImage}
                style={{ opacity: 1, mixBlendMode: 'plus-lighter' }}
                loading="lazy"
                alt="background"
            />
        </div>
    );
};

export default Background;