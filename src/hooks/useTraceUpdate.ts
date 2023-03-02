import * as React from 'react'

/*
  This hook is used to debug props getting changed in functional component
  How to use: useTraceUpdate("Component Name", props);
*/

function useTraceUpdate(name: any, props: any) {
  const prev = React.useRef(props)
  React.useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v]
      }
      return ps
    }, {} as any)

    if (Object.keys(changedProps).length > 0) {
      console.info(name + ' Changed props:', changedProps) // eslint-disable-line no-console
    }
    prev.current = props
  })
}

export { useTraceUpdate }
