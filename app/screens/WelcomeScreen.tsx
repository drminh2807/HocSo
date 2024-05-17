import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { StyleSheet, View, TouchableOpacity } from "react-native"
import { AppStackScreenProps } from "../navigators"
import { Screen, Text } from "@components"
import { Audio } from "expo-av"
import * as WebBrowser from "expo-web-browser"
import { colors } from "@theme/colors"
import Ionicons from "@expo/vector-icons/Ionicons"
import useScreenScale from "@utils/useScreenScale"
import { useStores } from "@models/index"

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen({
  navigation,
}) {
  const {
    learningStore: { shouldLock, showLock },
  } = useStores()
  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true })
  }, [])
  const { scale } = useScreenScale()
  return (
    <Screen preset="fixed">
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.setting}
          onPress={() => {
            navigation.navigate("ParentPass", { mode: "setting" })
          }}
        >
          <Ionicons size={scale(44)} name="settings" color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.playList}
          onPress={() => {
            navigation.navigate("AllWords")
          }}
        >
          <Ionicons size={scale(44)} name="book" color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (shouldLock) {
              showLock()
            } else {
              navigation.navigate("Player")
            }
          }}
        >
          <Ionicons name="play-circle" size={scale(150)} color={colors.text} />
        </TouchableOpacity>
      </View>
      <Text
        onPress={() =>
          WebBrowser.openBrowserAsync(
            "https://docs.google.com/document/d/1Y0m1m4UO1Q1UBdAPwNTQDHlopXT66l2SQkumpBotpVg",
          )
        }
        style={styles.privacyUrl}
      >
        Chính sách quyền riêng tư
      </Text>
    </Screen>
  )
})

const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  item: {
    justifyContent: "center",
    marginRight: 16,
  },
  modal: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.background,
    borderRadius: 16,
    justifyContent: "center",
    padding: 16,
  },
  playList: {
    left: 8,
    position: "absolute",
    top: 8,
  },
  privacyUrl: {
    textAlign: "center",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 16,
  },
  rowBottom: {
    flexDirection: "row",
    gap: 16,
  },
  setting: {
    position: "absolute",
    right: 8,
    top: 8,
  },
})
