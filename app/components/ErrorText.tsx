import * as React from "react"
import { StyleProp, TextStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"

export interface ErrorTextProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<TextStyle>
  error?: Error
}

/**
 * Describe your component here
 */
export const ErrorText = observer(function ErrorText(props: ErrorTextProps) {
  const { style, error } = props
  if (!error) {
    return null
  }
  return <Text style={[$text, style]}>{error.message}</Text>
})

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.primary500,
}
