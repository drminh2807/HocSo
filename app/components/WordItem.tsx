import * as React from "react"
import { Image, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native"
import { observer } from "mobx-react-lite"
import { Word } from "@models/Database"

export interface WordItemProps {
  borderColor?: string
  disabled?: boolean
  onPress?: () => void
  word: Word
}

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
        source={word.image}
        resizeMode="cover"
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
