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