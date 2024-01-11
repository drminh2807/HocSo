import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useState } from "react"
import {
  StyleSheet,
  View,
  Alert,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native"
import { AppStackScreenProps } from "../navigators"
import { Button, Icon, Screen, Text, TextField } from "@components"
import { Audio } from "expo-av"
import { useStores } from "@models/index"
import { Image } from "expo-image"
import * as WebBrowser from "expo-web-browser"
import ReceiveSharingIntent from "react-native-receive-sharing-intent"
import Constants from "expo-constants"
import Modal from "react-native-modal"
import { colors } from "@theme/colors"

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
  const [search, setSearch] = useState("")
  const [pendingVideoId, setPendingVideoId] = useState("")
  const window = useWindowDimensions()
  const width = useMemo(() => window.width / 3, [window])
  const height = useMemo(() => width / (16 / 9), [width])
  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true })

    // To get All Recived Urls
    ReceiveSharingIntent.getReceivedFiles(
      (files) => {
        const link = files?.[0]?.weblink || files?.[0]?.text || ""
        validateUrl(link)
      },
      (error) => {
        console.log(error)
      },
      Constants.expoConfig?.scheme,
    )
    return () => {
      ReceiveSharingIntent.clearReceivedFiles()
    }
  }, [])

  const validateUrl = (url: string) => {
    const videoId = getVideoId(url)
    if (videoId) {
      setPendingVideoId(videoId)
    } else {
      Alert.alert("Lỗi", "Link video không hợp lệ")
    }
  }

  const handleVideo = (videoId: string) => {
    setPendingVideoId("")
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
        <Button text="Tìm kiếm" onPress={() => validateUrl(search)} />
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
      <Modal
        isVisible={!!pendingVideoId}
        onBackButtonPress={() => setPendingVideoId("")}
        onBackdropPress={() => setPendingVideoId("")}
      >
        <View style={styles.modal}>
          <Text>Xem video này?</Text>
          <Image
            source={{ uri: `https://img.youtube.com/vi/${pendingVideoId}/0.jpg` }}
            style={[{ height, width }, styles.image]}
          />
          <View style={[styles.row, { width }]}>
            <Button
              style={styles.button}
              text="Xem"
              preset="filled"
              onPress={() => handleVideo(pendingVideoId)}
            />
            <Icon icon="x" onPress={() => setPendingVideoId("")} />
          </View>
        </View>
      </Modal>
    </Screen>
  )
})

const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  container: {
    flex: 1,
    gap: 8,
    justifyContent: "center",
    margin: 8,
  },
  image: {
    marginTop: 16,
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
})
