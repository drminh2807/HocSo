import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
// import { FlatList, StyleSheet, TouchableOpacity, View, useWindowDimensions } from "react-native"
import { Alert, StyleSheet, View } from "react-native"
import { AppStackScreenProps } from "../navigators" // @demo remove-current-line
// import { useAsync } from "react-async-hook"
// import { api } from "@services/api"
// import FastImage from "react-native-fast-image"
import { Button, Screen, TextField } from "@components"
import { Audio } from "expo-av"

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
  const [search, setSearch] = React.useState("")
  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true })
  }, [])
  // const { result, error } = useAsync((q) => api.getVideos(q), [search])
  // const window = useWindowDimensions()
  // const width = useMemo(() => window.width / 3, [window])
  // const height = useMemo(() => width / (16 / 9), [width])
  return (
    <Screen preset="fixed" safeAreaEdges={["left", "right", "top", "bottom"]}>
      <View style={styles.container}>
        <TextField placeholder="Dán link video vào đây" value={search} onChangeText={setSearch} />
        <Button
          text="Tìm kiếm"
          onPress={() => {
            const videoId = getVideoId(search)
            if (videoId) {
              navigation.navigate("Player", { videoId })
            } else {
              Alert.alert("Lỗi", "Link video không hợp lệ")
            }
          }}
        />
        <Button
          text="Cài đặt"
          onPress={() => {
            navigation.navigate("ParentPass")
          }}
        />
      </View>
      {/* <ErrorText error={error} />
      <FlatList
        data={result?.data?.items || []}
        horizontal
        keyExtractor={(item) => item.id?.videoId || ""}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, { width }]}
            onPress={() => navigation.navigate("Player", { videoId: item.id?.videoId ?? "" })}
          >
            <FastImage
              source={{ uri: item.snippet?.thumbnails?.high?.url }}
              style={{ height, width }}
            />
            <Text numberOfLines={1}>{item.snippet?.title}</Text>
          </TouchableOpacity>
        )}
      /> */}
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
