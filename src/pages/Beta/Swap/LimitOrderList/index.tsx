import React, { useState, useEffect, useCallback } from 'react'
import {
  Text,
  Box,
  ToggleButtons,
  useGelatoLimitOrderList,
  useTranslation,
  DropdownMenu
} from '@pangolindex/components'
import LimitOrderRow from './LimitOrderRow'
import { DesktopLimitOrderList, GridContainer, MobileLimitOrderList } from './styleds'
import Scrollbars from 'react-custom-scrollbars'
import LimitOrderDetail from './LimitOrderDetail'
// import { Order } from '@gelatonetwork/limit-orders-react'
import CancelOrderModal from './CancelOrderModal'
import MobileLimitOrderRow from './MobileLimitOrderRow'
import ShowMore from 'src/components/Beta/ShowMore'
import { MultiValue } from 'react-select'

export enum TabType {
  open = 'OPEN',
  executed = 'EXECUTED',
  cancelled = 'CANCELLED'
}

export const LimitOrderTypeOptions = [
  {
    label: TabType?.open,
    value: TabType?.open
  },
  {
    label: TabType?.executed,
    value: TabType?.executed
  },
  {
    label: TabType?.cancelled,
    value: TabType?.cancelled
  }
]

const LimitOrderList = () => {
  const { t } = useTranslation()

  const [activeTab, setActiveTab] = useState<MultiValue<string> | string>(TabType.open as string)

  const [showMore, setShowMore] = useState(false as boolean)

  const { allOpenOrders, allCancelledOrders, executed } = useGelatoLimitOrderList()

  const [isCancelLimitOrderModalOpen, setIsCancelLimitOrderModalOpen] = useState(false)

  const handleCancelLimitOrderModal = useCallback(() => {
    setIsCancelLimitOrderModalOpen(false)
  }, [setIsCancelLimitOrderModalOpen])

  const [selectedOrder, setSelectedOrder] = useState({} as any)

  let displayOrders: any[]

  if (activeTab === TabType.open) {
    displayOrders = allOpenOrders
  } else if (activeTab === TabType.cancelled) {
    displayOrders = allCancelledOrders
  } else {
    displayOrders = executed
  }

  useEffect(() => {
    if ((displayOrders || []).length > 0) {
      setSelectedOrder(displayOrders?.[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayOrders])

  const mobileRow = (order: any) => {
    return (
      <MobileLimitOrderRow
        order={order}
        key={order.id}
        onClick={() => setSelectedOrder(order)}
        isSelected={order?.id === selectedOrder?.id}
        onClickCancelOrder={() => setIsCancelLimitOrderModalOpen(true)}
      />
    )
  }

  return (
    <Box>
      <MobileLimitOrderList>
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
          <Text color="text1" fontSize={24} fontWeight={500}>
            {t('swapPage.limitOrders')}
          </Text>

          <Box>
            <DropdownMenu
              options={LimitOrderTypeOptions}
              defaultValue={activeTab}
              onSelect={selected => {
                setActiveTab(selected)
              }}
            />
          </Box>
        </Box>

        <Box mt={10}>
          {(displayOrders || []).length > 0 ? (
            <>
              {(displayOrders || []).slice(0, 3).map(order => mobileRow(order))}

              {showMore && (displayOrders || []).slice(3).map(order => mobileRow(order))}

              {displayOrders.length > 3 && <ShowMore showMore={showMore} onToggle={() => setShowMore(!showMore)} />}
            </>
          ) : (
            <Text color="text1" fontSize={18} fontWeight={500} marginLeft={'6px'} textAlign="center">
              {t('swapPage.noLimitOrder', {
                orderType: activeTab
              })}
            </Text>
          )}
        </Box>
      </MobileLimitOrderList>
      <DesktopLimitOrderList>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Text color="text1" fontSize={24} fontWeight={500}>
            {t('swapPage.limitOrders')}
          </Text>

          <Box width="250px">
            <ToggleButtons
              options={[t('swapPage.open'), t('swapPage.executed'), t('swapPage.cancelled')]}
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
              <Text color="text1" fontSize={14} fontWeight={500} marginLeft={'6px'} textAlign="center">
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
      </DesktopLimitOrderList>
    </Box>
  )
}
export default LimitOrderList
