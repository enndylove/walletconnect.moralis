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