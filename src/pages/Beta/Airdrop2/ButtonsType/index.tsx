import React from 'react'
import { Button } from '@0xkilo/components'
import { useWalletModalToggle } from 'src/state/application/hooks'
import { useTranslation } from 'react-i18next'
// import Web3 from 'web3';

export const ButtonToConnect = () => {
    const toggleWalletModal = useWalletModalToggle()
    const { t } = useTranslation()
    return (
        <Button variant="primary" color='white' height='46px' onClick={toggleWalletModal}>
            <span style={{ whiteSpace: 'nowrap', color: '#FFF', fontSize: '20px' }}>{t('swapPage.connectWallet')}</span>
        </Button>
    )
}

// export const ButtonChangeChain = () => {

//     const switchNetworkFantom = async () => {
//         //@ts-ignore
//         const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
//         web3.eth.getAccounts().then(console.log);
    
//         try {
//         //@ts-ignore
//             await web3.currentProvider.request({
//             method: "wallet_switchEthereumChain",
//             params: [{ chainId: "0xFA" }],
//             });
//         } catch (error) {
//             //@ts-ignore
//             if (error.code === 4902) {
//             try {
//                 //@ts-ignore
//                 await web3.currentProvider.request({
//                 method: "wallet_addEthereumChain",
//                 params: [
//                     {
//                     chainId: "0xFA",
//                     chainName: "Fantom Opera",
//                     rpcUrls: ["https://rpc.ftm.tools/"],
//                     nativeCurrency: {
//                         name: "FTM",
//                         symbol: "FTM",
//                         decimals: 18,
//                     },
//                     blockExplorerUrls: ["https://ftmscan.com/"],
//                     },
//                 ],
//                 });
//             } catch (error) {
//                 //@ts-ignore
//                 alert(error.message);
//             }
//             }
//         }
//     }
    
//     return (
//     <Button variant="primary" color='white' height='46px' onClick={switchNetworkFantom}>
//         <span style={{ whiteSpace: 'nowrap', color: '#FFF', fontSize: '20px' }}>GO TO FANTOM</span>
//     </Button>
//     )
// }

export const ButtonClaimReward = () => {
    return (
        <Button variant="primary" color='white' height='46px'>
            <span style={{ whiteSpace: 'nowrap', color: '#FFF', fontSize: '20px' }}>CLAIM</span>
        </Button>
    )
}

export default [ButtonToConnect, ButtonClaimReward]

