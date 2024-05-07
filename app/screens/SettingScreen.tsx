import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Alert, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Button, CounterButton, Header, Screen, Text } from "@components"
import { useStores } from "app/models"
import { colors } from "@theme/colors"
import { typography } from "@theme/typography"

interface SettingScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Setting">> {}

const languages = {
  vi: "🇻🇳",
  en: "🇺🇸",
}

export const SettingScreen: FC<SettingScreenProps> = observer(function SettingScreen({
  navigation,
}) {
  const {
    learningStore: { MINUTE_PER_TURN, LEARN_PER_TURN, setProp, LANGUAGE, reset },
  } = useStores()
  return (
    <Screen style={$root} safeAreaEdges={["left", "right"]}>
      <Header leftIcon="back" onLeftPress={() => navigation.goBack()} />
      <View style={$container}>
        <View style={$item}>
          <Text style={$text} text="Số phút xem video mỗi lượt" />
          <CounterButton
            value={MINUTE_PER_TURN}
            onChange={(value) => setProp("MINUTE_PER_TURN", value)}
            min={1}
            max={30}
          />
        </View>
        <View style={$item}>
          <Text
            style={$text}
            text="Số lần trả lời đúng mỗi lượt (càng lớn học mỗi lượt càng lâu)"
          />
          <CounterButton
            value={LEARN_PER_TURN}
            onChange={(value) => setProp("LEARN_PER_TURN", value)}
            min={5}
            max={30}
          />
        </View>
        <View style={$item}>
          <Text style={$text}>Ngôn ngữ học</Text>
          <View style={$switch}>
            <TouchableOpacity
              style={$button}
              onPress={() => {
                setProp("LANGUAGE", "vi")
              }}
            >
              <Text style={$switchText}>{"<"}</Text>
            </TouchableOpacity>
            <View style={$button}>
              <Text style={$text}>{languages[LANGUAGE]}</Text>
            </View>
            <TouchableOpacity
              style={$button}
              onPress={() => {
                setProp("LANGUAGE", "en")
              }}
            >
              <Text style={$switchText}>{">"}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Button
          text="Khôi phục cài đặt gốc và tiến trình học"
          onPress={() => {
            Alert.alert(
              "Khôi phục cài đặt gốc và tiến trình học",
              "Bạn có chắc chắn muốn khôi phục cài đặt gốc và tiến trình học?",
              [
                { text: "Hủy", style: "cancel" },
                {
                  text: "Khôi phục",
                  onPress: async () => {
                    reset()
                    navigation.popToTop()
                  },
                  style: "destructive",
                },
              ],
            )
          }}
        />
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  flex: 1,
  gap: 16,
  padding: 16,
}

const $item: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 16,
}

const $switch: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const $text: ViewStyle = {
  flex: 1,
}

const $switchText: TextStyle = {
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
