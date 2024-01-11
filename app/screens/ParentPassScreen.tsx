import React, { FC, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { TextField, Header, Screen, Text, Button } from "@components"
import { random } from "lodash"
import Toast from "react-native-root-toast"

interface ParentPassScreenProps extends AppStackScreenProps<"ParentPass"> {}

export const ParentPassScreen: FC<ParentPassScreenProps> = observer(function ParentPassScreen({
  navigation,
  route,
}) {
  const { mode } = route.params
  const number1 = useMemo(() => random(3, 6), [])
  const number2 = useMemo(() => random(4, 6), [])
  const [text, setText] = useState("")
  const onSubmit = () => {
    if (number1 * number2 === Number(text)) {
      if (mode === "welcome") {
        navigation.navigate("Welcome")
      } else {
        navigation.replace(mode === "setting" ? "Setting" : "Player")
      }
    } else {
      Toast.show("Sai rồi, thử lại nhé!")
    }
  }
  return (
    <Screen style={$root} preset="fixed" safeAreaEdges={["left", "right"]}>
      <Header leftIcon="back" onLeftPress={() => navigation.goBack()} />
      <View style={$container}>
        <Text text={`${number1}x${number2}=`} preset="heading" style={$text} />
        <TextField
          value={text}
          onChangeText={setText}
          keyboardType="number-pad"
          placeholder="Nhập kết quả phép nhân"
          style={$input}
          autoFocus
          disableFullscreenUI
          onSubmitEditing={onSubmit}
        />
        <Button text='Kiểm tra' onPress={onSubmit} />
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  gap: 16,
}

const $text: TextStyle = {
  textAlign: "center",
}

const $input: TextStyle = {
  textAlign: "center",
  fontSize: 24,
}
