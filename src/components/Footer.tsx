// @ts-ignore
import style from "./../styles/Footer.module.scss"

import { icons } from "../dist/pictures/icons/icons.tsx"

/**
 * Footer component that displays a footer section with links to social media profiles and a GitHub code link.
 *
 * @returns {JSX.Element} The footer component.
 * @example
 * <Footer />
 */
const Footer = () => {
    const types: string[] = ["github", "leetcode", "linkedin", "codewars"]
    const links: string[] = [
        "https://github.com/enndylove",
        "https://leetcode.com/u/enndylove/",
        "https://www.linkedin.com/in/andriy-khomitskyi/",
        "https://www.codewars.com/users/enndy"
    ]
    return (
        <footer className={`w-full flex justify-center fixed bottom-0`} style={{padding: "0 16px"}}>
            <div className={`flex w-full items-center ${style.footer}`}>
                <div className={`${style.footer__block} ${style.footer__block_left}`}>
                    enndy
                </div>
                <div className={`${style.footer__links} w-full flex items-center justify-between`}>
                    {
                        types.map((type, index) => (
                            <a className={style.footer__link} href={links[index]} key={index}>
                                <img
                                    className={style.footer__icon}
                                    src={icons[index]}
                                    alt={`${type} icon`}
                                />
                            </a>
                        ))
                    }
                </div>
                <a href={"https://github.com/enndylove/walletconnect.moralis"} target="_blank" rel="noopener noreferrer" className={`${style.footer__block} ${style.footer__block_right}`}>
                    github code
                </a>
            </div>
        </footer>
    );
};

export default Footer;