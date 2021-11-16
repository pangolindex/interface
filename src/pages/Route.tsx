import React from 'react'
import { Route as BaseRoute, RouteProps } from 'react-router-dom'

interface Props {
  layout: React.FC<any>
  component: React.FC
}

const Route = ({ layout: Layout, component: Component, ...rest }: Props & RouteProps) => {
  return (
    <BaseRoute
      {...rest}
      render={props => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  )
}

export default Route
