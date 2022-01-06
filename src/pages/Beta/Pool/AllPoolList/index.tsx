import React from 'react'
import PoolV1 from './PoolV1'
import PoolV2 from './PoolV2'

interface Props {
  version: number
  type: string
}
const AllPoolList: React.FC<Props> = ({ version, type }) => {
  return version === 1 ? <PoolV1 type={type} /> : <PoolV2 type={type} />
}

export default AllPoolList
