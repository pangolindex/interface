import React, { useState, useEffect } from 'react'
import MigrateUI from './Migrate'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen } from '../../state/application/hooks'

const Migrate = () => {
  const isModalOpen = useModalOpen(ApplicationModal.MIGRATION)
  const [refreshData, setRefreshData] = useState(true)

  useEffect(() => {
    if (!isModalOpen) {
      setRefreshData(false)
      setTimeout(() => {
        setRefreshData(true)
      }, 50)
    }
  }, [isModalOpen])

  return refreshData ? <MigrateUI /> : null
}

export default Migrate
