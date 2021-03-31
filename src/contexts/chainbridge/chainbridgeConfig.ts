export type TokenConfig = {
    address: string
    name?: string
    symbol?: string
    imageUri?: string
    resourceId: string
    isNativeWrappedToken?: boolean
}
export type BridgeConfig = {
    chainId: number
    networkId: number
    name: string
    bridgeAddress: string
    erc20HandlerAddress: string
    rpcUrl: string
    type: 'Ethereum' | 'Substrate'
    tokens: TokenConfig[]
    nativeTokenSymbol: string
    //This should be the full path to display a tx hash, without the trailing slash, ie. https://etherscan.io/tx
    blockExplorer?: string
    defaultGasPrice?: number
}
export type ChainbridgeConfig = {
    chains: BridgeConfig[]
}
export const chainbridgeConfig: ChainbridgeConfig = {
    // Ethereum - Avalanche Bridge
    chains: [
        {
            chainId: 1,
            networkId: 1,
            name: 'Ethereum',
            bridgeAddress: '0x96B845aBE346b49135B865E5CeDD735FC448C3aD',
            erc20HandlerAddress: '0xdAC7Bb7Ce4fF441A235F08408e632FA1D799A147',
            rpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/_fDQvapBN8NpXuyLk_aQgXTsnnTDzjaS',
            type: 'Ethereum',
            blockExplorer: 'https://etherscan.io/tx',
            nativeTokenSymbol: 'ETH',
            tokens: [
                {
                    'address': '0x9dEbca6eA3af87Bf422Cea9ac955618ceb56EfB4',
                    'name': 'Avalanche',
                    'symbol': 'AVAX',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/ethereum-tokens/0x9dEbca6eA3af87Bf422Cea9ac955618ceb56EfB4/logo.png',
                    'resourceId': '0x00000000000000000000009dEbca6eA3af87Bf422Cea9ac955618ceb56EfB402'
                },
                {
                    'address': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
                    'name': 'Wrapped Ether',
                    'symbol': 'WETH',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15/logo.png',
                    'resourceId': '0x0000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc201',
                    'isNativeWrappedToken': true
                },
                {
                    'address': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
                    'name': 'Tether USD',
                    'symbol': 'USDT',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xde3A24028580884448a5397872046a019649b084/logo.png',
                    'resourceId': '0x0000000000000000000000dac17f958d2ee523a2206206994597c13d831ec701'
                },
                {
                    'address': '0x514910771AF9Ca656af840dff83E8264EcF986CA',
                    'name': 'ChainLink Token',
                    'symbol': 'LINK',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xB3fe5374F67D7a22886A0eE082b2E2f9d2651651/logo.png',
                    'resourceId': '0x0000000000000000000000514910771af9ca656af840dff83e8264ecf986ca01'
                },
                {
                    'address': '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
                    'name': 'Wrapped BTC',
                    'symbol': 'WBTC',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x408D4cD0ADb7ceBd1F1A1C33A0Ba2098E1295bAB/logo.png',
                    'resourceId': '0x00000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c59901'
                },
                {
                    'address': '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
                    'name': 'Uniswap',
                    'symbol': 'UNI',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xf39f9671906d8630812f9d9863bBEf5D523c84Ab/logo.png',
                    'resourceId': '0x00000000000000000000001f9840a85d5af5bf1d1762f925bdaddc4201f98401'
                },
                {
                    'address': '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
                    'name': 'Aave Token',
                    'symbol': 'AAVE',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x8cE2Dee54bB9921a2AE0A63dBb2DF8eD88B91dD9/logo.png',
                    'resourceId': '0x00000000000000000000007fc66500c84a76ad7e9c93437bfc5ac33e2ddae901'
                },
                {
                    'address': '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
                    'name': 'Synthetix Network Token',
                    'symbol': 'SNX',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x68e44C4619db40ae1a0725e77C02587bC8fBD1c9/logo.png',
                    'resourceId': '0x0000000000000000000000c011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f01'
                },
                {
                    'address': '0x6B175474E89094C44Da98b954EedeAC495271d0F',
                    'name': 'Dai Stablecoin',
                    'symbol': 'DAI',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xbA7dEebBFC5fA1100Fb055a87773e1E99Cd3507a/logo.png',
                    'resourceId': '0x00000000000000000000006b175474e89094c44da98b954eedeac495271d0f01'
                },
                {
                    'address': '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
                    'name': 'Binance USD',
                    'symbol': 'BUSD',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xaEb044650278731Ef3DC244692AB9F64C78FfaEA/logo.png',
                    'resourceId': '0x00000000000000000000004fabb145d64652a948d72533023f6e7a623c7c5301'
                },
                {
                    'address': '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
                    'name': 'Maker',
                    'symbol': 'MKR',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x8DF92E9C0508aB0030d432DA9F2C65EB1Ee97620/logo.png',
                    'resourceId': '0x00000000000000000000009f8F72aA9304c8B593d555F12eF6589cC3A579A201'
                },
                {
                    'address': '0x6f259637dcD74C767781E37Bc6133cd6A68aa161',
                    'name': 'HuobiToken',
                    'symbol': 'HT',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x421b2a69b886BA17a61C7dAd140B9070d5Ef300B/logo.png',
                    'resourceId': '0x00000000000000000000006f259637dcd74c767781e37bc6133cd6a68aa16101'
                },
                {
                    'address': '0xc00e94Cb662C3520282E6f5717214004A7f26888',
                    'name': 'Compound',
                    'symbol': 'COMP',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x53CEedB4f6f277edfDDEdB91373B044FE6AB5958/logo.png',
                    'resourceId': '0x0000000000000000000000c00e94cb662c3520282e6f5717214004a7f2688801'
                },
                {
                    'address': '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
                    'name': 'SushiToken',
                    'symbol': 'SUSHI',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x39cf1BD5f15fb22eC3D9Ff86b0727aFc203427cc/logo.png',
                    'resourceId': '0x00000000000000000000006b3595068778dd592e39a122f4f5a5cf09c90fe201'
                },
                {
                    'address': '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
                    'name': 'yearn.finance',
                    'symbol': 'YFI',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x99519AcB025a0e0d44c3875A4BbF03af65933627/logo.png',
                    'resourceId': '0x00000000000000000000000bc529c00c6401aef6d220be8c6ea1667f6ad93e01'
                },
                {
                    'address': '0x0316EB71485b0Ab14103307bf65a021042c6d380',
                    'name': 'Huobi BTC',
                    'symbol': 'HBTC',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x8c1632b83D9E2D3C31B0728e953A22B7B33348A3/logo.png',
                    'resourceId': '0x00000000000000000000000316eb71485b0ab14103307bf65a021042c6d38001'
                },
                {
                    'address': '0x3155BA85D5F96b2d030a4966AF206230e46849cb',
                    'name': 'THORChain ETH.RUNE',
                    'symbol': 'RUNE',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x390ba0fb0Bd3Aa2a5484001606329701148074e6/logo.png',
                    'resourceId': '0x00000000000000000000003155ba85d5f96b2d030a4966af206230e46849cb01'
                },
                {
                    'address': '0xc944E90C64B2c07662A292be6244BDf05Cda44a7',
                    'name': 'Graph Token',
                    'symbol': 'GRT',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x46C54b16aF7747067f412c78eBaDaE203a26aDa0/logo.png',
                    'resourceId': '0x0000000000000000000000c944e90c64b2c07662a292be6244bdf05cda44a701'
                },
                {
                    'address': '0x8E870D67F660D95d5be530380D0eC0bd388289E1',
                    'name': 'Paxos Standard',
                    'symbol': 'PAX',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x403985fD6628E44b6fca9876575b9503cB80A47A/logo.png',
                    'resourceId': '0x00000000000000000000008e870d67f660d95d5be530380d0ec0bd388289e101'
                },
                {
                    'address': '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828',
                    'name': 'UMA Voting Token v1',
                    'symbol': 'UMA',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xC84d7bfF2555955b44BDF6A307180810412D751B/logo.png',
                    'resourceId': '0x000000000000000000000004fa0d235c4abf4bcf4787af4cf447de572ef82801'
                },
                {
                    'address': '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD',
                    'name': 'LoopringCoin V2',
                    'symbol': 'LRC',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x628A9639cc78F46604A625452C0242c7B487BA3c/logo.png',
                    'resourceId': '0x0000000000000000000000bbbbca6a901c926f240b89eacb641d8aec7aeafd01'
                },
                {
                    'address': '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
                    'name': 'OMGToken',
                    'symbol': 'OMG',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x276C6670b97F22cE7Ad754b08CB330DECb6a3332/logo.png',
                    'resourceId': '0x0000000000000000000000d26114cd6ee289accf82350c8d8487fedb8a0c0701'
                },
                {
                    'address': '0x408e41876cCCDC0F92210600ef50372656052a38',
                    'name': 'Republic Token',
                    'symbol': 'REN',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xAc6C38f2DeC391b478144Ae7F078D08B08d0a284/logo.png',
                    'resourceId': '0x0000000000000000000000408e41876cccdc0f92210600ef50372656052a3801'
                },
                {
                    'address': '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
                    'name': 'Basic Attention Token',
                    'symbol': 'BAT',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x6b329326E0F6b95B93b52229b213334278D6f277/logo.png',
                    'resourceId': '0x00000000000000000000000d8775f648430679a709e98d2b0cb6250d2887ef01'
                },
                {
                    'address': '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
                    'name': '0x Protocol Token',
                    'symbol': 'ZRX',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xC8E94215b75F5B9c3b5fB041eC3A97B7D17a37Ff/logo.png',
                    'resourceId': '0x0000000000000000000000e41d2489571d322189246dafa5ebde1f4699f49801'
                }
            ],
        },
        {
            chainId: 2,
            networkId: 43114,
            name: 'Avalanche',
            bridgeAddress: '0x6460777cDa22AD67bBb97536FFC446D65761197E',
            erc20HandlerAddress: '0x6147F5a1a4eEa5C529e2F375Bd86f8F58F8Bc990',
            rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
            type: 'Ethereum',
            blockExplorer: 'https://cchain.explorer.avax.network/tx',
            nativeTokenSymbol: 'AVAX',
            defaultGasPrice: 470,
            tokens: [
                {
                    'address': '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
                    'name': 'Wrapped Avalanche',
                    'symbol': 'WAVAX',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7/logo.png',
                    'resourceId': '0x00000000000000000000009dEbca6eA3af87Bf422Cea9ac955618ceb56EfB402',
                    'isNativeWrappedToken': true
                },
                {
                    'address': '0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15',
                    'name': 'Ether',
                    'symbol': 'ETH',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15/logo.png',
                    'resourceId': '0x0000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc201'
                },
                {
                    'address': '0xde3A24028580884448a5397872046a019649b084',
                    'name': 'Tether USD',
                    'symbol': 'USDT',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xde3A24028580884448a5397872046a019649b084/logo.png',
                    'resourceId': '0x0000000000000000000000dac17f958d2ee523a2206206994597c13d831ec701'
                },
                {
                    'address': '0xB3fe5374F67D7a22886A0eE082b2E2f9d2651651',
                    'name': 'ChainLink Token',
                    'symbol': 'LINK',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xB3fe5374F67D7a22886A0eE082b2E2f9d2651651/logo.png',
                    'resourceId': '0x0000000000000000000000514910771af9ca656af840dff83e8264ecf986ca01'
                },
                {
                    'address': '0x408D4cD0ADb7ceBd1F1A1C33A0Ba2098E1295bAB',
                    'name': 'Wrapped BTC',
                    'symbol': 'WBTC',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x408D4cD0ADb7ceBd1F1A1C33A0Ba2098E1295bAB/logo.png',
                    'resourceId': '0x00000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c59901'
                },
                {
                    'address': '0xf39f9671906d8630812f9d9863bBEf5D523c84Ab',
                    'name': 'Uniswap',
                    'symbol': 'UNI',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xf39f9671906d8630812f9d9863bBEf5D523c84Ab/logo.png',
                    'resourceId': '0x00000000000000000000001f9840a85d5af5bf1d1762f925bdaddc4201f98401'
                },
                {
                    'address': '0x8cE2Dee54bB9921a2AE0A63dBb2DF8eD88B91dD9',
                    'name': 'Aave Token',
                    'symbol': 'AAVE',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x8cE2Dee54bB9921a2AE0A63dBb2DF8eD88B91dD9/logo.png',
                    'resourceId': '0x00000000000000000000007fc66500c84a76ad7e9c93437bfc5ac33e2ddae901'
                },
                {
                    'address': '0x68e44C4619db40ae1a0725e77C02587bC8fBD1c9',
                    'name': 'Synthetix Network Token',
                    'symbol': 'SNX',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x68e44C4619db40ae1a0725e77C02587bC8fBD1c9/logo.png',
                    'resourceId': '0x0000000000000000000000c011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f01'
                },
                {
                    'address': '0xbA7dEebBFC5fA1100Fb055a87773e1E99Cd3507a',
                    'name': 'Dai Stablecoin',
                    'symbol': 'DAI',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xbA7dEebBFC5fA1100Fb055a87773e1E99Cd3507a/logo.png',
                    'resourceId': '0x00000000000000000000006b175474e89094c44da98b954eedeac495271d0f01'
                },
                {
                    'address': '0xaEb044650278731Ef3DC244692AB9F64C78FfaEA',
                    'name': 'Binance USD',
                    'symbol': 'BUSD',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xaEb044650278731Ef3DC244692AB9F64C78FfaEA/logo.png',
                    'resourceId': '0x00000000000000000000004fabb145d64652a948d72533023f6e7a623c7c5301'
                },
                {
                    'address': '0x8DF92E9C0508aB0030d432DA9F2C65EB1Ee97620',
                    'name': 'Maker',
                    'symbol': 'MKR',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x8DF92E9C0508aB0030d432DA9F2C65EB1Ee97620/logo.png',
                    'resourceId': '0x00000000000000000000009f8F72aA9304c8B593d555F12eF6589cC3A579A201'
                },
                {
                    'address': '0x421b2a69b886BA17a61C7dAd140B9070d5Ef300B',
                    'name': 'HuobiToken',
                    'symbol': 'HT',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x421b2a69b886BA17a61C7dAd140B9070d5Ef300B/logo.png',
                    'resourceId': '0x00000000000000000000006f259637dcd74c767781e37bc6133cd6a68aa16101'
                },
                {
                    'address': '0x53CEedB4f6f277edfDDEdB91373B044FE6AB5958',
                    'name': 'Compound',
                    'symbol': 'COMP',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x53CEedB4f6f277edfDDEdB91373B044FE6AB5958/logo.png',
                    'resourceId': '0x0000000000000000000000c00e94cb662c3520282e6f5717214004a7f2688801'
                },
                {
                    'address': '0x39cf1BD5f15fb22eC3D9Ff86b0727aFc203427cc',
                    'name': 'SushiToken',
                    'symbol': 'SUSHI',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x39cf1BD5f15fb22eC3D9Ff86b0727aFc203427cc/logo.png',
                    'resourceId': '0x00000000000000000000006b3595068778dd592e39a122f4f5a5cf09c90fe201'
                },
                {
                    'address': '0x99519AcB025a0e0d44c3875A4BbF03af65933627',
                    'name': 'yearn.finance',
                    'symbol': 'YFI',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x99519AcB025a0e0d44c3875A4BbF03af65933627/logo.png',
                    'resourceId': '0x00000000000000000000000bc529c00c6401aef6d220be8c6ea1667f6ad93e01'
                },
                {
                    'address': '0x8c1632b83D9E2D3C31B0728e953A22B7B33348A3',
                    'name': 'Huobi BTC',
                    'symbol': 'HBTC',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x8c1632b83D9E2D3C31B0728e953A22B7B33348A3/logo.png',
                    'resourceId': '0x00000000000000000000000316eb71485b0ab14103307bf65a021042c6d38001'
                },
                {
                    'address': '0x390ba0fb0Bd3Aa2a5484001606329701148074e6',
                    'name': 'THORChain ETH.RUNE',
                    'symbol': 'RUNE',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x390ba0fb0Bd3Aa2a5484001606329701148074e6/logo.png',
                    'resourceId': '0x00000000000000000000003155ba85d5f96b2d030a4966af206230e46849cb01'
                },
                {
                    'address': '0x46C54b16aF7747067f412c78eBaDaE203a26aDa0',
                    'name': 'Graph Token',
                    'symbol': 'GRT',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x46C54b16aF7747067f412c78eBaDaE203a26aDa0/logo.png',
                    'resourceId': '0x0000000000000000000000c944e90c64b2c07662a292be6244bdf05cda44a701'
                },
                {
                    'address': '0x403985fD6628E44b6fca9876575b9503cB80A47A',
                    'name': 'Paxos Standard',
                    'symbol': 'PAX',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x403985fD6628E44b6fca9876575b9503cB80A47A/logo.png',
                    'resourceId': '0x00000000000000000000008e870d67f660d95d5be530380d0ec0bd388289e101'
                },
                {
                    'address': '0xC84d7bfF2555955b44BDF6A307180810412D751B',
                    'name': 'UMA Voting Token v1',
                    'symbol': 'UMA',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xC84d7bfF2555955b44BDF6A307180810412D751B/logo.png',
                    'resourceId': '0x000000000000000000000004fa0d235c4abf4bcf4787af4cf447de572ef82801'
                },
                {
                    'address': '0x628A9639cc78F46604A625452C0242c7B487BA3c',
                    'name': 'LoopringCoin V2',
                    'symbol': 'LRC',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x628A9639cc78F46604A625452C0242c7B487BA3c/logo.png',
                    'resourceId': '0x0000000000000000000000bbbbca6a901c926f240b89eacb641d8aec7aeafd01'
                },
                {
                    'address': '0x276C6670b97F22cE7Ad754b08CB330DECb6a3332',
                    'name': 'OMGToken',
                    'symbol': 'OMG',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x276C6670b97F22cE7Ad754b08CB330DECb6a3332/logo.png',
                    'resourceId': '0x0000000000000000000000d26114cd6ee289accf82350c8d8487fedb8a0c0701'
                },
                {
                    'address': '0xAc6C38f2DeC391b478144Ae7F078D08B08d0a284',
                    'name': 'Republic Token',
                    'symbol': 'REN',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xAc6C38f2DeC391b478144Ae7F078D08B08d0a284/logo.png',
                    'resourceId': '0x0000000000000000000000408e41876cccdc0f92210600ef50372656052a3801'
                },
                {
                    'address': '0x6b329326E0F6b95B93b52229b213334278D6f277',
                    'name': 'Basic Attention Token',
                    'symbol': 'BAT',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x6b329326E0F6b95B93b52229b213334278D6f277/logo.png',
                    'resourceId': '0x00000000000000000000000d8775f648430679a709e98d2b0cb6250d2887ef01'
                },
                {
                    'address': '0xC8E94215b75F5B9c3b5fB041eC3A97B7D17a37Ff',
                    'name': '0x Protocol Token',
                    'symbol': 'ZRX',
                    'imageUri': 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xC8E94215b75F5B9c3b5fB041eC3A97B7D17a37Ff/logo.png',
                    'resourceId': '0x0000000000000000000000e41d2489571d322189246dafa5ebde1f4699f49801'
                }
            ],
        },
    ],
}
