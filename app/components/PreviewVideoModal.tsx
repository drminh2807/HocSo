import React from "react"
import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { colors } from "app/theme"
import { Text } from "app/components/Text"
import Modal from "react-native-modal"
import { Image } from "expo-image"
import { Icon } from "./Icon"
import { Button } from "./Button"
import usePreviewImageSize from "@utils/usePreviewImageSize"
import { useStores } from "@models/index"

export interface PreviewVideoModalProps {}

export const PreviewVideoModal = observer(function PreviewVideoModal(_: PreviewVideoModalProps) {
  const {
    playVideo,
    videoStore: { pendingVideoId, setPendingVideoId },
  } = useStores()

  const { width, height } = usePreviewImageSize()
  return (
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
            onPress={() => playVideo(pendingVideoId)}
          />
          <Icon icon="x" onPress={() => setPendingVideoId("")} />
        </View>
      </View>
    </Modal>
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
  rowBottom: {
    flexDirection: "row",
    gap: 16,
  },
})
