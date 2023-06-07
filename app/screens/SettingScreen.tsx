import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Alert, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Button, CounterButton, Header, Screen, Text } from "@components"
import { useStores } from "app/models"
import AsyncStorage from "@react-native-async-storage/async-storage"
import RNRestart from "react-native-restart"

interface SettingScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Setting">> {}

export const SettingScreen: FC<SettingScreenProps> = observer(function SettingScreen({
  navigation,
}) {
  const {
    learningStore: { MAX_CORRECT, MINUTE_PER_TURN, LEARN_PER_TURN, setProp },
  } = useStores()
  return (
    <Screen style={$root} safeAreaEdges={["left", "right"]}>
      <Header leftIcon="back" onLeftPress={() => navigation.goBack()} />
      <View style={$container}>
        <View style={$item}>
          <CounterButton
            value={MAX_CORRECT}
            onChange={(value) => setProp("MAX_CORRECT", value)}
            min={5}
            max={10}
          />
          <Text text="Số lần học 1 số (càng lớn học 1 số càng kỹ)" />
        </View>
        <View style={$item}>
          <CounterButton
            value={MINUTE_PER_TURN}
            onChange={(value) => setProp("MINUTE_PER_TURN", value)}
            min={1}
            max={30}
          />
          <Text text="Số phút xem video mỗi lượt" />
        </View>
        <View style={$item}>
          <CounterButton
            value={LEARN_PER_TURN}
            onChange={(value) => setProp("LEARN_PER_TURN", value)}
            min={5}
            max={30}
          />
          <Text text="Số lần trả lời đúng mỗi lượt (càng lớn học mỗi lượt càng lâu)" />
        </View>
        <Button
          text="Khôi phục cài đặt gốc và tiến trình học"
          onPress={() => {
            Alert.alert(
              "Khôi phục cài đặt gốc và tiến trình học",
              "Bạn có chắc chắn muốn khôi phục cài đặt gốc và tiến trình học?",
              [
                { text: "Hủy", style: "cancel" },
                { text: "Khôi phục", onPress: async () => {
                  await AsyncStorage.clear()
                  RNRestart.restart()
                }, style: "destructive" },
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
}

const $item: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 16,
}
