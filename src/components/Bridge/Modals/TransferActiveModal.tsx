import React from "react"
import {useActiveWeb3React} from "../../../hooks";
import {Break, CardBGImage, CardNoise, CardSection, DataCard} from "../../earn/styled";
import {RowBetween} from "../../Row";
import {CustomLightSpinner, TYPE} from "../../../theme";
import {AlertTriangle, CheckCircle, X} from "react-feather"
import {AutoColumn, ColumnCenter} from "../../Column";
import styled from "styled-components"
import {ButtonPrimary} from "../../Button";
import {useChainbridge} from "../../../contexts/chainbridge/ChainbridgeContext";
import Circle from "../../../assets/images/blue-loader.svg"

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

const ModalUpper = styled(DataCard)`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #f97316 0%, #E84142 100%);
  padding: 0.5rem;
`

const StyledClose = styled(X)`
  position: absolute;
  right: 16px;
  top: 16px;

  :hover {
    cursor: pointer;
  }
`

interface TransferActiveModalProps {
  open: boolean
  close: () => void
}

export default function TransferActiveModal({
                                              open,
                                              close,
                                            }: TransferActiveModalProps) {
  const {account} = useActiveWeb3React()
  const {
    transactionStatus,
    depositVotes,
    relayerThreshold,
    inTransitMessages,
    homeChain,
    destinationChain,
    depositAmount,
    // transferTxHash, TODO: add link to blockexplorer on complete
    selectedToken,
    transactionStatusReason,
  } = useChainbridge()

  let tokenKey = selectedToken && homeChain?.tokens && homeChain.tokens.find(x => x.address === selectedToken)
  const tokenSymbol = tokenKey ? tokenKey.symbol : " "

  return (
    <ContentWrapper gap="lg">
      <ModalUpper>
        <CardBGImage/>
        <CardNoise/>
        <CardSection gap="md">
          <RowBetween>
            <TYPE.white color="white">Transfer status</TYPE.white>
            <StyledClose stroke="white" onClick={close}/>
          </RowBetween>
        </CardSection>
        <Break/>
        {account && (
          <>
            <CardSection gap="sm">
              <AutoColumn gap="md">
                <RowBetween>
                  <ConfirmedIcon>
                    {transactionStatus === "Initializing Transfer" || transactionStatus === "In Transit" ? (
                      <CustomLightSpinner src={Circle} alt="loader" size={'90px'}/>
                    ) : transactionStatus === "Transfer Completed" ? (
                      <CheckCircle size={'90px'}/>
                    ) : (
                      <AlertTriangle size={'90px'}/>
                    )}

                  </ConfirmedIcon>

                  <TYPE.white color="white" width={'80%'}>
                    <h3>
                      {transactionStatus === "Initializing Transfer" ? (
                        "Step 1/3"
                      ) : transactionStatus === "In Transit" ? (
                        "Step 2/3"
                      ) : transactionStatus === "Transfer Completed" ? (
                        "Step 3/3"
                      ) : (
                        "Error"
                      )}</h3>
                    <p>
                      {transactionStatus === "Initializing Transfer"
                        ? "Initializing Transfer"
                        : transactionStatus === "In Transit"
                          ? `In Transit (${depositVotes}/${relayerThreshold} signatures needed)`
                          : transactionStatus === "Transfer Completed"
                            ? "Transfer completed"
                            : "Transfer aborted"}                  </p>
                  </TYPE.white>

                </RowBetween>
              </AutoColumn>
            </CardSection>
            <Break/>
          </>
        )}
        <CardSection gap="sm">
          <AutoColumn gap="md">
            <RowBetween>
              {transactionStatus === "Initializing Transfer" ? (
                <TYPE.white color="white">
                  Deposit pending...<br/>
                  This should take a few minutes.
                  <br/>
                  Please do not refresh or leave the page.
                </TYPE.white>
              ) : transactionStatus === "In Transit" ? (
                <TYPE.white color="white">
                  {inTransitMessages.map((m, i) => {
                    if (typeof m === "string") {
                      return (
                        <span key={i}>{m}</span>
                      )
                    } else {
                      return (
                        <span key={i}>Vote cast by {m.address} ({m.signed})</span>
                      )
                    }
                  })}
                  <p>
                    This should take a few minutes. <br/>
                    Please do not refresh or leave the page.
                  </p>
                </TYPE.white>
              ) : transactionStatus === "Transfer Completed" ? (
                <TYPE.white color="white">
                  Successfully transferred{" "}
                  <strong>
                    {depositAmount} {tokenSymbol}
                    <br/> from {homeChain?.name} to {destinationChain?.name}.
                  </strong>
                </TYPE.white>
                // TODO: add link to view Tx
              ) : (
                <TYPE.white color="white">
                  {transactionStatusReason}
                </TYPE.white>
              )}
            </RowBetween>
          </AutoColumn>
        </CardSection>
        <CardSection gap="sm">
          <AutoColumn gap="md">
            <RowBetween>
              <ButtonPrimary onClick={close}>Close</ButtonPrimary>

            </RowBetween>
          </AutoColumn>
        </CardSection>
      </ModalUpper>
    </ContentWrapper>
  )
}