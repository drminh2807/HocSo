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

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.option,
        {
          width: width * 0.2,
          height: width * 0.2,
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
            width: width * 0.2 - 16,
            height: width * 0.28,
          },
          word.category === "animal"
            ? // eslint-disable-next-line react-native/no-inline-styles
              { top: -4, width: width * 0.2 - 32, height: ((width * 0.2 - 32) / 212) * 300 }
            : word.category === "alphabet"
            ? // eslint-disable-next-line react-native/no-inline-styles
              { bottom: -20, width: width * 0.2 - 16, height: ((width * 0.2) / 212) * 300 }
            : // eslint-disable-next-line react-native/no-inline-styles
              { top: -16, width: width * 0.2 - 16, height: width * 0.28 },
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
    alignItems: "center",
    borderWidth: 8,
    justifyContent: "center",
    overflow: "hidden",
  },
})
