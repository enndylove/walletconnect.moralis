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