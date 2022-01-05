import React from 'react'
import PoolV1 from './PoolV1'
import PoolV2 from './PoolV2'

interface Props {
  version: number
}
const AllPoolList: React.FC<Props> = ({ version }) => {
  return version === 1 ? <PoolV1 /> : <PoolV2 />
}

export default AllPoolList
