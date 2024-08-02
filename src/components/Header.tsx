// @ts-ignore
import headerLogo from './../dist/pictures/logos/header__logo.png'
import { useWeb3Modal } from '@web3modal/wagmi/react'
// @ts-ignore
import useBalance from "../hooks/useData.tsx";

/**
 * Header component that displays the logo and account balance.
 *
 * @returns {JSX.Element} The Header component.
 *
 * @example
 * import Header from './Header';
 *
 * const App = () => {
 *   return (
 *     <div>
 *       <Header />
 *     </div>
 *   );
 * };
 */
const Header = () => {
    /**
     * Fetches the user's balance using the `useBalance` hook.
     */
    useBalance();

    return (
        <header className={"flex w-full wrapper justify-between items-center header"}>
            <img src={headerLogo} loading={"lazy"} alt="logo" className="header__logo"/>
            {/*<w3m-button balance={"show"}/>*/}
            <w3m-account-button balance={"show"}/>
        </header>
    );
};

export default Header;