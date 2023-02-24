import styled from 'styled-components'
import { AutoColumn } from '../Column'

export const DataCard = styled(AutoColumn)<{ disabled?: boolean }>`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #f97316 0%, #e84142 100%);
  border-radius: 12px;
  width: 100%;
  position: relative;
  overflow: hidden;
`

export const CardSection = styled(AutoColumn)<{ disabled?: boolean }>`
  padding: 1rem;
  z-index: 1;
  opacity: ${({ disabled }) => disabled && '0.4'};
`
