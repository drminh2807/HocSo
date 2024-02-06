import { useCallback } from "react"
import { useWindowDimensions } from "react-native"

export default () => {
    const { width, height } = useWindowDimensions()
    const wScale = useCallback((size: number) => (size / 375) * width, [width])
    const hScale = useCallback((size: number) => (size / 812) * height, [height])
    const scale = useCallback((size: number) => Math.min(wScale(size), hScale(size)), [wScale, hScale])
    return { scale, wScale, hScale }
}