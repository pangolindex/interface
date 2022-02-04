import React, { useState, useEffect, useCallback } from 'react'
import { Text, Box, ToggleButtons } from '@pangolindex/components'
import LimitOrderRow from './LimitOrderRow'
import { WatchListRoot, GridContainer } from './styleds'
import Scrollbars from 'react-custom-scrollbars'
import LimitOrderDetail from './LimitOrderDetail'
import { useTranslation } from 'react-i18next'
import { Order } from '@gelatonetwork/limit-orders-react'
import CancelOrderModal from './CancelOrderModal'
import { useGelatoLimitOrderList } from 'src/state/swap/hooks'

export enum TabType {
  all = 'ALL',
  open = 'OPEN',
  executed = 'EXECUTED',
  cancelled = 'CANCELLED'
}

const LimitOrderList = () => {
  const { t } = useTranslation()

  const [activeTab, setActiveTab] = useState(TabType.all as string)

  const { allOrders, allOpenOrders, allCancelledOrders, executed } = useGelatoLimitOrderList()

  const [isCancelLimitOrderModalOpen, setIsCancelLimitOrderModalOpen] = useState(false)

  const handleCancelLimitOrderModal = useCallback(() => {
    setIsCancelLimitOrderModalOpen(false)
  }, [setIsCancelLimitOrderModalOpen])

  const [selectedOrder, setSelectedOrder] = useState({} as Order)

  let displayOrders: Order[]

  if (activeTab === TabType.open) {
    displayOrders = allOpenOrders
  } else if (activeTab === TabType.cancelled) {
    displayOrders = allCancelledOrders
  } else if (activeTab === TabType.executed) {
    displayOrders = executed
  } else {
    displayOrders = allOrders
  }

  useEffect(() => {
    if ((displayOrders || []).length > 0) {
      setSelectedOrder(displayOrders?.[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayOrders])

  return (
    <WatchListRoot>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Text color="text1" fontSize={32} fontWeight={500}>
          {t('swapPage.limitOrders')}
        </Text>

        <Box>
          <ToggleButtons
            options={[t('swapPage.all'), t('swapPage.open'), t('swapPage.executed'), t('swapPage.cancelled')]}
            value={activeTab}
            onChange={value => {
              setActiveTab(value)
            }}
          />
        </Box>
      </Box>
      <GridContainer>
        <LimitOrderDetail order={selectedOrder} onClickCancelOrder={() => setIsCancelLimitOrderModalOpen(true)} />
        <Box>
          {(displayOrders || []).length > 0 ? (
            <Scrollbars>
              {(displayOrders || []).map(order => (
                <LimitOrderRow
                  order={order}
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  isSelected={order?.id === selectedOrder?.id}
                />
              ))}
            </Scrollbars>
          ) : (
            <Text color="text1" fontSize={18} fontWeight={500} marginLeft={'6px'} textAlign="center">
              {t('swapPage.noLimitOrder', {
                orderType: activeTab
              })}
            </Text>
          )}
        </Box>
      </GridContainer>

      <CancelOrderModal
        isOpen={isCancelLimitOrderModalOpen}
        onClose={handleCancelLimitOrderModal}
        order={selectedOrder}
      />
    </WatchListRoot>
  )
}
export default LimitOrderList
