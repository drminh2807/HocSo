import * as React from "react"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"

export interface CounterButtonProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
}

/**
 * Describe your component here
 */
export const CounterButton = observer(function CounterButton({
  value,
  onChange,
  min,
  max,
  step = 1
}: CounterButtonProps) {
  return (
    <View style={$container}>
      <TouchableOpacity
        style={$button}
        onPress={() => {
          if (value > min) {
            onChange(value - step)
          }
        }}
      >
        <Text style={$text}>-</Text>
      </TouchableOpacity>
      <View style={$button}>
        <Text style={$text}>{value}</Text>
      </View>
      <TouchableOpacity
        style={$button}
        onPress={() => {
          if (value < max) {
            onChange(value + step)
          }
        }}
      >
        <Text style={$text}>+</Text>
      </TouchableOpacity>
    </View>
  )
})

const $container: ViewStyle = {
  flexDirection: "row",
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.primary500,
}

const $button: ViewStyle = {
  width: 32,
  height: 32,
  alignItems: "center",
  justifyContent: "center",
  borderColor: colors.border,
  borderWidth: 1,
}
