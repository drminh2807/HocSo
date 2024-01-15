import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  AppState,
  BackHandler,
  LayoutRectangle,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { AppStackScreenProps } from "@navigators"
import { Header, LearningModal, Screen } from "@components"
import YoutubePlayer from "react-native-youtube-iframe"
import { useStores } from "@models"

interface PlayerScreenProps extends AppStackScreenProps<"Player"> {}

export const PlayerScreen: FC<PlayerScreenProps> = observer(function PlayerScreen({ navigation }) {
  const { showModal, videoId } = useStores().learningStore
  const [playing, setPlaying] = useState(true)
  const [layout, setLayout] = useState<LayoutRectangle>()
  const [showHeader, setShowHeader] = useState(false)
  const [appState, setAppState] = useState(AppState.currentState)
  useEffect(() => {
    const subscrible = AppState.addEventListener("change", (state) => {
      setAppState(state)
    })
    return () => {
      subscrible.remove()
    }
  }, [])

  useEffect(() => {
    setPlaying(!showModal && appState === "active")
  }, [showModal, appState])

  const onBack = () => {
    navigation.navigate("ParentPass", { mode: "welcome" })
    return true
  }

  useEffect(() => {
    const subscrible = AppState.addEventListener("change", (state) => {
      setAppState(state)
    })
    const backHandler = BackHandler.addEventListener("hardwareBackPress", onBack)
    return () => {
      subscrible.remove()
      backHandler.remove()
    }
  }, [])

  return (
    <Screen
      style={$root}
      preset="fixed"
      safeAreaEdges={showHeader ? ["bottom", "left", "right", "top"] : []}
    >
      {showHeader ? <Header leftIcon="back" onLeftPress={onBack} /> : null}
      <TouchableOpacity
        style={styles.container}
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
            webViewProps={{ mediaPlaybackRequiresUserAction: Platform.OS === "ios" }}
            onChangeState={(event) => {
              if (event === "ended") {
                setPlaying(false)
              }
            }}
            onError={(error) => {
              console.log(error)
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
  backgroundColor: "black",
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
})
