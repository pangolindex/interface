import React from 'react'
import { ContentWrapper, Panel } from './styleds'
import { Text, Box } from '@pangolindex/components'

export interface StatProps {
  icon?: React.ReactNode
  title?: React.ReactNode
  stat?: any
}

const StatCard = ({ icon, title, stat }: StatProps) => {
  return (
    <Panel>
      <ContentWrapper>
        {icon && icon}

        <Box>
          {stat && (
            <Text color="text1" fontSize={42} fontWeight={500}>
              {stat}
            </Text>
          )}

          {title && (
            <Text color="text1" fontSize={24}>
              {title}
            </Text>
          )}
        </Box>
      </ContentWrapper>
    </Panel>
  )
}

export default StatCard
