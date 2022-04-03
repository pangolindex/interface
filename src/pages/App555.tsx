import React from "react";
import {
    CHAIN_ID_BSC,
    CHAIN_ID_ETH,
    CHAIN_ID_SOLANA,
  } from "@certusone/wormhole-sdk";

  import { useCallback } from "react";
  import { useHistory, useLocation } from "react-router";
  import {
    Redirect,
    Route,
    Switch,
  } from "react-router-dom";
  import Attest from "./Beta/Bridge/components/Attest";
  import Migration from "./Beta/Bridge/components/Migration";
  import EvmQuickMigrate from "./Beta/Bridge/components/Migration/EvmQuickMigrate";
  import SolanaQuickMigrate from "./Beta/Bridge/components/Migration/SolanaQuickMigrate";
  import NFT from "./Beta/Bridge/components/NFT";
  import NFTOriginVerifier from "./Beta/Bridge/components/NFTOriginVerifier";
  import Recovery from "./Beta/Bridge/components/Recovery";
  import Stats from "./Beta/Bridge/components/Stats";
  import TokenOriginVerifier from "./Beta/Bridge/components/TokenOriginVerifier";
  import Transfer from "./Beta/Bridge/components/Transfer";
  import WithdrawTokensTerra from "./Beta/Bridge/components/WithdrawTokensTerra";
  
  function App() {
    const { push } = useHistory();
    const { pathname } = useLocation();
    const handleTabChange = useCallback(
      (event, value) => {
        push(value);
      },
      [push]
    );
    return (
        <div >
          {/* {["/transfer", "/nft", "/redeem"].includes(pathname) ? (
            <Container maxWidth="md" style={{ paddingBottom: 24 }}>
              <Tabs
                value={pathname}
                variant="fullWidth"
                onChange={handleTabChange}
                indicatorColor="primary"
              >
                <Tab label="Tokens" value="/transfer" />
                <Tab label="NFTs" value="/nft" />
                <Tab label="Redeem" value="/redeem" to="/redeem" />
              </Tabs>
            </Container>
          ) : null} */}
          <Switch>
            <Route exact path="/transfer">
              <Transfer />
            </Route>
            <Route exact path="/nft">
              <NFT />
            </Route>
            <Route exact path="/redeem">
              <Recovery />
            </Route>
            <Route exact path="/nft-origin-verifier">
              <NFTOriginVerifier />
            </Route>
            <Route exact path="/token-origin-verifier">
              <TokenOriginVerifier />
            </Route>
            <Route exact path="/register">
              <Attest />
            </Route>
            <Route exact path="/migrate/Solana/:legacyAsset/:fromTokenAccount">
              <Migration chainId={CHAIN_ID_SOLANA} />
            </Route>
            <Route exact path="/migrate/Ethereum/:legacyAsset/">
              <Migration chainId={CHAIN_ID_ETH} />
            </Route>
            <Route exact path="/migrate/BinanceSmartChain/:legacyAsset/">
              <Migration chainId={CHAIN_ID_BSC} />
            </Route>
            <Route exact path="/migrate/Ethereum/">
              <EvmQuickMigrate chainId={CHAIN_ID_ETH} />
            </Route>
            <Route exact path="/migrate/BinanceSmartChain/">
              <EvmQuickMigrate chainId={CHAIN_ID_BSC} />
            </Route>
            <Route exact path="/migrate/Solana/">
              <SolanaQuickMigrate />
            </Route>
            <Route exact path="/stats">
              <Stats />
            </Route>
            <Route exact path="/withdraw-tokens-terra">
              <WithdrawTokensTerra />
            </Route>
            <Route>
              <Redirect to="/transfer" />
            </Route>
          </Switch>
        </div>
     
    );
  }
  
  export default App;
  