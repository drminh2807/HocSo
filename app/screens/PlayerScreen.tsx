import React, { FC, useCallback, useEffect, useRef } from "react"
import { observer } from "mobx-react-lite"
import { BackHandler, Platform, StyleSheet } from "react-native"
import { AppStackScreenProps } from "@navigators"
import { LearningModal, Screen } from "@components"
import { WebView } from "react-native-webview"
import { colors } from "@theme/colors"
import { useStores } from "@models/index"

interface PlayerScreenProps extends AppStackScreenProps<"Player"> {}

export const PlayerScreen: FC<PlayerScreenProps> = observer(function PlayerScreen({ navigation }) {
  const {
    learningStore: { showModal },
  } = useStores()
  const onBack = () => {
    navigation.navigate("ParentPass", { mode: "welcome" })
    return true
  }

  useEffect(() => {
    if (Platform.OS === "web") return
    const backHandler = BackHandler.addEventListener("hardwareBackPress", onBack)
    return () => {
      backHandler.remove()
    }
  }, [])
  const webViewRef = useRef<WebView>(null)
  const togglePlay = useCallback(() => {
    webViewRef.current?.injectJavaScript(
      'document.getElementById("player-play-pause-button").click()',
    )
  }, [])
  useEffect(() => {
    togglePlay()
  }, [showModal])

  return (
    <Screen style={styles.root} preset="fixed">
      <WebView
        ref={webViewRef}
        source={{ uri: "https://www.youtubekids.com/" }}
        style={styles.root}
        allowsInlineMediaPlayback
        allowsFullscreenVideo={false}
        sharedCookiesEnabled
        userAgent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15"
      />
      <LearningModal togglePlay={togglePlay} />
    </Screen>
  )
})

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    flex: 1,
  },
})
