import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { AppState, LayoutRectangle, TouchableOpacity, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "@navigators"
import { Header, LearningModal, Screen } from "@components"
import YoutubePlayer from "react-native-youtube-iframe"
import { useStores } from "@models"

interface PlayerScreenProps extends AppStackScreenProps<"Player"> {}

export const PlayerScreen: FC<PlayerScreenProps> = observer(function PlayerScreen({
  route,
  navigation,
}) {
  const { showModal } = useStores().learningStore
  const { videoId } = route.params
  const [playing, setPlaying] = useState(true)
  const [layout, setLayout] = useState<LayoutRectangle>()
  const [showHeader, setShowHeader] = useState(false)
  useEffect(() => {
    const subscrible = AppState.addEventListener("change", (state) => {
      setPlaying(state === "active")
    })
    return () => {
      subscrible.remove()
    }
  }, [])

  useEffect(() => {
    setPlaying(!showModal)
  }, [showModal])

  return (
    <Screen
      style={$root}
      preset="fixed"
      safeAreaEdges={showHeader ? ["bottom", "left", "right", "top"] : []}
    >
      {showHeader ? <Header leftIcon="back" onLeftPress={() => navigation.goBack()} /> : null}
      <TouchableOpacity
        style={$root}
        onPress={() => setShowHeader((prev) => !prev)}
        activeOpacity={1}
        onLayout={({ nativeEvent }) => setLayout(nativeEvent.layout)}
      >
        <View style={$root} pointerEvents="none">
          <YoutubePlayer
            height={layout?.height ?? 300}
            width={layout?.width ?? 200}
            play={playing}
            videoId={videoId}
            onChangeState={(event) => {
              if (event === "ended") {
                setPlaying(false)
              }
            }}
          />
        </View>
      </TouchableOpacity>
      <LearningModal />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
