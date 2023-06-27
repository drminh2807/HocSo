import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { StyleSheet, View, Alert } from "react-native"
import { AppStackScreenProps } from "../navigators"
import { Button, Screen, TextField } from "@components"
import { Audio } from "expo-av"
import { useStores } from "@models/index"

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
  const { learningStore } = useStores()
  const [search, setSearch] = React.useState("")
  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true })
  }, [])
  return (
    <Screen preset="fixed" safeAreaEdges={["left", "right", "top", "bottom"]}>
      <View style={styles.container}>
        <TextField placeholder="Dán link video vào đây" value={search} onChangeText={setSearch} />
        <Button
          text="Tìm kiếm"
          onPress={() => {
            const videoId = getVideoId(search)
            if (videoId) {
              learningStore.setProp("videoId", videoId)
              navigation.navigate("ParentPass", { mode: "player" })
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
      </View>
    </Screen>
  )
})

const styles = StyleSheet.create({
  container: {
    gap: 16,
    justifyContent: "center",
    margin: 16,
  },
  item: {
    justifyContent: "center",
    marginRight: 16,
  },
})
