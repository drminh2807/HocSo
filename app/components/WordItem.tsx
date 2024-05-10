import * as React from "react"
import { StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native"
import { observer } from "mobx-react-lite"
import { Word } from "@models/Database"
import { Image } from "expo-image"

export interface WordItemProps {
  borderColor?: string
  disabled?: boolean
  onPress?: () => void
  word: Word
}
const blurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj"
/**
 * Describe your component here
 */
export const WordItem = observer(function WordItem({
  disabled,
  onPress,
  word,
  borderColor,
}: WordItemProps) {
  const { width } = useWindowDimensions()
  const itemWidth = width * 0.2
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.option,
        {
          width: itemWidth,
          height: itemWidth,
          borderColor,
        },
      ]}
    >
      <Image
        source={`https://firebasestorage.googleapis.com/v0/b/hocsochobe.appspot.com/o/images%2F${word.dashEn}.jpg?alt=media`}
        contentFit="cover"
        placeholder={{ blurhash }}
        style={[
          styles.image,
          {
            width: itemWidth,
            height: (itemWidth / 212) * 300,
            transform: [{ scale: word.category === "number" ? 1.16 : 1.3 }],
          },
        ]}
      />
    </TouchableOpacity>
  )
})

const styles = StyleSheet.create({
  image: {
    position: "absolute",
  },
  option: {
    borderWidth: 8,
    overflow: "hidden",
  },
})
