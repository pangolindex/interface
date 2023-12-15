# Pangolin Interface

An open source interface for Pangolin -- a community-driven decentralized exchange for Avalanche and Ethereum assets with fast settlement, low transaction fees, and a democratic distribution -- powered by Avalanche.

- Website: [pangolin.exchange](https://pangolin.exchange/)
- Interface: [app.pangolin.exchange](https://app.pangolin.exchange)
- Telegram: [Pangolin](https://t.me/pangolindexV2)
- Discord: [Pangolin](https://discord.com/invite/CZttnRaYjK)
- Twitter: [@pangolindex](https://twitter.com/pangolindex)



## Accessing the Pangolin Interface

Visit [app.pangolin.exchange](https://app.pangolin.exchange).

## Development

### Install Dependencies

```bash
yarn
```


### Run

```bash
yarn start
```

### Configuring the environment (optional)

To have the interface default to a different network when a wallet is not connected:

1. Make a copy of `.env.sample` named `.env`

Note that the interface only works on testnets where both 
[Pangolin](https://github.com/pangolindex/exchange-contracts) and 
[multicall](https://github.com/makerdao/multicall) are deployed.
The interface will not work on other networks.

## Attribution
This code was adapted from this Uniswap repo: [uniswap-interface](https://github.com/Uniswap/uniswap-interface)
