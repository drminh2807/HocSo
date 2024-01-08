import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo } from "react"
import {
  StyleSheet,
  View,
  Alert,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native"
import { AppStackScreenProps } from "../navigators"
import { Button, Screen, Text, TextField } from "@components"
import { Audio } from "expo-av"
import { useStores } from "@models/index"
import { Image } from "expo-image"
import * as WebBrowser from "expo-web-browser"

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

const getVideoId = (url: string) => {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  if (match && match[2].length === 11) {
    return match[2]
  } else {
    return undefined
  }
}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen({
  navigation,
}) {
  const { learningStore, videoStore } = useStores()
  const { videos } = videoStore
  const [search, setSearch] = React.useState("")
  const window = useWindowDimensions()
  const width = useMemo(() => window.width / 3, [window])
  const height = useMemo(() => width / (16 / 9), [width])
  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true })
  }, [])

  const handleVideo = (videoId: string) => {
    learningStore.setProp("videoId", videoId)
    videoStore.saveVideo(videoId)
    navigation.navigate("ParentPass", { mode: "player" })
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["left", "right", "top", "bottom"]}>
      <View style={styles.container}>
        <FlatList
          data={videos}
          horizontal
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.item, { width }]} onPress={() => handleVideo(item)}>
              <Image
                source={{ uri: `https://img.youtube.com/vi/${item}/0.jpg` }}
                style={{ height, width }}
              />
            </TouchableOpacity>
          )}
        />
        <TextField placeholder="Dán link video vào đây" value={search} onChangeText={setSearch} />
        <Button
          text="Tìm kiếm"
          onPress={() => {
            const videoId = getVideoId(search)
            if (videoId) {
              handleVideo(videoId)
            } else {
              Alert.alert("Lỗi", "Link video không hợp lệ")
            }
          }}
        />
        <Button
          text="Cài đặt"
          onPress={() => {
            navigation.navigate("ParentPass", { mode: "setting" })
          }}
        />
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
      </View>
    </Screen>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    justifyContent: "center",
    margin: 8,
  },
  item: {
    justifyContent: "center",
    marginRight: 16,
  },
  privacyUrl: {
    textAlign: "center",
  },
})
