import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, FlatList, StyleSheet, TouchableOpacity, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Header, Screen, TextField } from "app/components"
import { useStores } from "@models/index"
import usePreviewImageSize from "@utils/usePreviewImageSize"
import { Image } from "expo-image"
import getVideoId from "@utils/getVideoId"

interface PlaylistScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Playlist">> {}

export const PlaylistScreen: FC<PlaylistScreenProps> = observer(function PlaylistScreen({
  navigation,
}) {
  const {
    videoStore: { videos, setPendingVideoId },
    playVideo,
  } = useStores()
  const [search, setSearch] = useState("")
  const { width, height } = usePreviewImageSize()
  const validateUrl = (url: string) => {
    const videoId = getVideoId(url)
    if (videoId) {
      setPendingVideoId(videoId)
    } else {
      Alert.alert("Lỗi", "Link video không hợp lệ")
    }
  }
  return (
    <Screen style={$root} preset="fixed">
      <Header
        leftIcon="back"
        onLeftPress={navigation.goBack}
        TitleComponent={
          <TextField
            containerStyle={styles.textField}
            placeholder="Dán link video vào đây"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={() => validateUrl(search)}
            keyboardType="url"
            returnKeyType="search"
          />
        }
        rightIcon="x"
        onRightPress={() => setSearch("")}
      />
      <FlatList
        contentContainerStyle={styles.list}
        data={videos}
        horizontal
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.item, { width }]} onPress={() => playVideo(item)}>
            <Image
              source={{ uri: `https://img.youtube.com/vi/${item}/0.jpg` }}
              style={{ height, width }}
            />
          </TouchableOpacity>
        )}
      />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
const styles = StyleSheet.create({
  item: {
    justifyContent: "center",
    marginRight: 16,
  },
  list: {
    paddingLeft: 16,
  },
  textField: {
    flex: 1,
  }
})
