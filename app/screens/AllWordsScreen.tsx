import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, StyleSheet, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Header, Screen, Text, WordItem } from "app/components"
import { words } from "@models/Database"
import { playSound } from "@services/SoundService"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface AllWordsScreenProps extends NativeStackScreenProps<AppStackScreenProps<"AllWords">> {}

export const AllWordsScreen: FC<AllWordsScreenProps> = observer(function AllWordsScreen({
  navigation,
}) {
  return (
    <Screen style={$root} preset="fixed">
      <Header leftIcon="back" onLeftPress={() => navigation.goBack()} />
      <FlatList
        data={words}
        horizontal
        keyExtractor={(item) => item.en}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <WordItem
              borderColor="transparent"
              word={item}
              onPress={() => {
                playSound(item.enSound)
              }}
            />
            <Text style={styles.text}>{item.en}</Text>
          </View>
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
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
})
