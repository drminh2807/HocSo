import { useMemo } from "react"
import { useWindowDimensions } from "react-native"

export default () => {
  const window = useWindowDimensions()
  const width = useMemo(() => window.width / 3, [window])
  const height = useMemo(() => width / (16 / 9), [width])
  return { width, height }
}
