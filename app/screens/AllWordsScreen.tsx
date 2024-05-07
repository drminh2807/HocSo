import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, StyleSheet, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Header, Screen, Text, WordItem } from "app/components"
import { words } from "@models/Database"
import { playSound, sleep } from "@services/SoundService"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"
import PQueue from "queue"
import { checkAudioExists, clearCache } from "@services/CacheManager"

const queue = new PQueue({ concurrency: 1, autostart: true })

interface AllWordsScreenProps extends NativeStackScreenProps<AppStackScreenProps<"AllWords">> {}

export const AllWordsScreen: FC<AllWordsScreenProps> = observer(function AllWordsScreen({
  navigation,
}) {
  return (
    <Screen style={$root} preset="fixed">
      <Header
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
        rightIcon="debug"
        onRightPress={async () => {
          await clearCache()
          words.forEach((word, index) => {
            queue.push(async () => {
              console.log(`Playing ${index} ${word.en}`)
              const [playEn, playVi] = await Promise.all([
                checkAudioExists("en", word.dashEn, "wav"),
                checkAudioExists("vi", word.dashEn, "wav"),
              ])
              if (!playEn || !playVi) {
                queue.stop()
                console.log("Stopped")
              }
            })
          })
        }}
      />
      <FlatList
        data={words}
        horizontal
        keyExtractor={(item) => item.en}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <WordItem
              borderColor="transparent"
              word={item}
              onPress={async () => {
                await playSound(item)
                await sleep(300)
                await playSound(item, true)
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
