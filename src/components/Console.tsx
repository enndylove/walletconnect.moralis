// @ts-ignore
import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import style from '../styles/Console.module.scss';
// @ts-ignore
import Banner from './ui/Banner.tsx';
// @ts-ignore
import useData from '../hooks/useData.tsx';

const blocks: string[] = ['wallet.json', 'transactions.json', 'nfts.json'];

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

/**
 * Console component.
 *
 * @returns {JSX.Element} The console component.
 */
const Console: React.FC = () => {
    const resultTitle = useTextInterval('WalletConnect & Moralis APIs', 100);
    const { nft: resultNFTs, wallet: resultWallet, balance, transactions } = useData();
    const [resultBalance, setResultBalance] = useState(balance);
    const [walletText, setWalletText] = useState('');

    useEffect(() => {
        const formatWallet = async () => {
            const wallet = await resultWallet;
            setResultBalance(balance);
            if (wallet) {
                setWalletText(`
{
    "address": ${wallet?.address},
    "balance": ${balance} ETH,
    "active_chains": [
        {
            "chain": ${wallet?.active_chains[0]?.chain || 'undefined'},
            "chain_id": ${wallet?.active_chains[0]?.chain_id || 'undefined'},
            ${wallet?.active_chains[0]?.first_transaction ? `
            "first_transaction": {
                "block_number": ${wallet?.active_chains[0]?.first_transaction?.block_number || 'undefined'},
                "block_timestamp": ${wallet?.active_chains[0]?.first_transaction?.block_timestamp || 'undefined'},
                "transaction_hash": ${wallet?.active_chains[0]?.first_transaction?.transaction_hash || 'undefined'}
            },
            ` : `"first_transaction": null,`}
            ${wallet?.active_chains[0]?.last_transaction ? `
            "last_transaction": {
                "block_number": ${wallet?.active_chains[0]?.last_transaction?.block_number || 'undefined'},
                "block_timestamp": ${wallet?.active_chains[0]?.last_transaction?.block_timestamp || 'undefined'},
                "transaction_hash": ${wallet?.active_chains[0]?.last_transaction?.transaction_hash || 'undefined'}
            }
            ` : `"last_transaction": null,`}
        }
    ]
}
                `);
            }
        };
        formatWallet();
    }, [resultWallet, balance]);

    /**
     * Formats an NFT object into a string.
     *
     * @param {any} nft - The NFT object.
     * @returns {string} The formatted NFT string.
     */
    const formatNFT = (nft: any): string => `
{
    "amount": ${nft.amount},
    "block_number": ${nft.block_number},
    "block_number_minted": ${nft.block_number_minted},
    "collection_banner_image": ${nft.collection_banner_image},
    "collection_logo": ${nft.collection_logo},
    "contract_type": ${nft.contract_type},
    "last_metadata_sync": ${nft.last_metadata_sync},
    "last_token_uri_sync": ${nft.last_token_uri_sync},
    "metadata": {
        "minter_address": ${nft.metadata ? nft.metadata.minter_address : 'N/A'},
    },
    "name": ${nft.name},
    "owner_of": ${nft.owner_of},
    "possible_spam": ${nft.possible_spam ? 'Yes' : 'No'},
    "symbol": ${nft.symbol},
    "token_address": ${nft.token_address},
    "token_hash": ${nft.token_hash},
    "token_id": ${nft.token_id},
    "token_uri": ${nft.token_uri},
    "verified_collection": ${nft.verified_collection ? 'Yes' : 'No'}
}
    `;

    /**
     * Formats a transaction object into a string.
     *
     * @param {any} transaction - The transaction object.
     * @returns {string} The formatted transaction string.
     */
    const formatTransactions = (transaction: any): string => `
{
    "hash": "${transaction.hash}",
    "nonce": "${transaction.nonce}",
    "transaction_index": "${transaction.transaction_index}",
    "from_address": "${transaction.from_address}",
    "from_address_label": "${transaction.from_address_label || 'N/A'}",
    "to_address": "${transaction.to_address}",
    "to_address_label": "${transaction.to_address_label || 'N/A'}",
    "value": "${(parseFloat(transaction.value) / Math.pow(10, 18)).toFixed(18)} ETH",
    "gas": "${transaction.gas}",
    "gas_price": "${(parseFloat(transaction.gas_price) / Math.pow(10, 18)).toFixed(18)} ETH",
    "input": "${transaction.input}",
    "receipt_cumulative_gas_used": "${transaction.receipt_cumulative_gas_used}",
    "receipt_gas_used": "${transaction.receipt_gas_used}",
    "receipt_status": "${transaction.receipt_status === '1' ? 'Success' : 'Failed'}",
    "block_timestamp": "${new Date(transaction.block_timestamp).toISOString()}",
    "block_number": "${transaction.block_number}",
    "block_hash": "${transaction.block_hash}",
    "transaction_fee": "${(parseFloat(transaction.transaction_fee) / Math.pow(10, 18)).toFixed(18)} ETH"
}
`;

    const transactionsText = Array.isArray(transactions) ? transactions.map(formatTransactions).join('\n\n') : '';

    const nftText = Array.isArray(resultNFTs) ? resultNFTs.map(formatNFT).join('\n\n') : '';
    const resultNFTsText = useTextInterval(nftText, 2);
    const resultWalletText = useTextInterval(walletText, 2);
    const resultTransactionsText = useTextInterval(transactionsText, 2);

    const [activeBlock, setActiveBlock] = useState(blocks[0]);
    const [isGreenActive, setGreenActive] = useState(false);

    /**
     * Handles the click event on a block.
     *
     * @param {string} blockName - The name of the block.
     */
    const handleClick = (blockName: string) => {
        setActiveBlock(blockName);
    };

    /**
     * Handles the click event on the green button.
     */
    const handleGreenButtonClick = () => {
        setGreenActive(!isGreenActive);
    };

    const [search, setSearch] = useState<string>('');
    const [debouncedSearch, setDebouncedSearch] = useState<string>(search);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    const requestAddress = useData(debouncedSearch, "0x1");

    /**
     * Formats the search result into a string.
     *
     * @returns {string} The formatted search result string.
     */
    function resultSearch() {
        try {
            if (activeBlock === 'nfts.json') {
                if (!Array.isArray(requestAddress?.nft?.result)) {
                    throw new Error('No results found.');
                }
                return requestAddress?.nft?.result.map(formatNFT).join('\n\n');
            } else if (activeBlock === 'wallet.json') {
                const wallet = requestAddress?.wallet;
                if (!wallet) {
                    throw new Error('No results found.');
                }
                return `
{
    "address": ${wallet?.address},
    "balance": ${requestAddress?.balance} ETH,
    "active_chains": [
        {
            "chain": ${wallet?.active_chains[0]?.chain || 'undefined'},
            "chain_id": ${wallet?.active_chains[0]?.chain_id || 'undefined'},
            ${wallet?.active_chains[0]?.first_transaction ? `
            "first_transaction": {
                "block_number": ${wallet?.active_chains[0]?.first_transaction?.block_number || 'undefined'},
                "block_timestamp": ${wallet?.active_chains[0]?.first_transaction?.block_timestamp || 'undefined'},
                "transaction_hash": ${wallet?.active_chains[0]?.first_transaction?.transaction_hash || 'undefined'}
            },
            ` : `"first_transaction": null,`}
            ${wallet?.active_chains[0]?.last_transaction ? `
            "last_transaction": {
                "block_number": ${wallet?.active_chains[0]?.last_transaction?.block_number || 'undefined'},
                "block_timestamp": ${wallet?.active_chains[0]?.last_transaction?.block_timestamp || 'undefined'},
                "transaction_hash": ${wallet?.active_chains[0]?.last_transaction?.transaction_hash || 'undefined'}
            }
            ` : `"last_transaction": null,`}
        }
    ]
}
                `;
            } else if (activeBlock === 'transactions.json') {
                const transactions = requestAddress?.transactions
                if (!Array.isArray(transactions)) {
                    throw new Error('No results found.');
                }
                return transactions.map(formatTransactions).join('\n\n');
            }
        } catch {
            return '';
        }
    }

    return (
        <section className="wrapper" style={{ height: '67%' }}>
            <h1 className={style.console__title}>
                {resultTitle}
            </h1>
            <div className={`${style.console} w-full ${isGreenActive ? style.console_active : ''}`}>
                <div className={`${style.console__header} w-full flex items-center justify-between`}>
                    <div className={`${style.console__files} flex items-center`}>
                        {blocks.map(block => (
                            <span
                                key={block}
                                className={`${style.console__file} ${activeBlock === block ? style.console__file_active : ''} cursor-pointer`}
                                onClick={() => handleClick(block)}
                            >
                                {block}
                            </span>
                        ))}
                    </div>
                    <div className={`${style.console__state} flex items-center`}>
                        <span
                            className={`${style.console__dot} ${style.console__dot_red}`}
                            onClick={() => {}}
                        ></span>
                        <span
                            className={`${style.console__dot} ${style.console__dot_yellow}`}
                            onClick={() => {}}
                        ></span>
                        <span
                            className={`${style.console__dot} ${style.console__dot_green}`}
                            onClick={handleGreenButtonClick}
                        ></span>
                    </div>
                </div>
                <div className={`${style.console__body}`}>
                    <pre className={style.console__result}>
                        {activeBlock === 'nfts.json' ? resultSearch() || resultNFTsText || 'No NFTs found.\nTry entering a different wallet address in the search\n\nThe address of the wallets can be taken from the website https://etherscan.io' : ''}
                        {activeBlock === 'wallet.json' ? resultSearch() || resultWalletText || 'loading information...' : ''}
                        {activeBlock === 'transactions.json' ? resultSearch() || resultTransactionsText || 'Don\'t have transactions.\nTry entering a different wallet address in the search\n\nThe address of the wallets can be taken from the website https://etherscan.io' : ''}
                    </pre>
                    <Banner />
                </div>
                <div className={`${style.console__footer} flex items-center justify-between w-full`}>
                    <input
                        type="text"
                        placeholder="Write ETH address"
                        onChange={(e) => setSearch(e.target.value)}
                        className={`${style.console__input} w-full`}
                    />
                    <button className={`${style.console__btn}`}>
                        search
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Console;