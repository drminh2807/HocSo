/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from "react"
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native"
import { observer } from "mobx-react-lite"
import { colors } from "@theme/colors"
import { useStores } from "@models"
import { words } from "@models/Database"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { playSound } from "@services/SoundService"
import { WordItem } from "./WordItem"
import { Header } from "./Header"
import { navigationRef } from "@navigators/navigationUtilities"

export interface LearningModalProps {}

/**
 * Describe your component here
 */
export const LearningModal = observer(function LearningModal(_: LearningModalProps) {
  const {
    learningStore: {
      number,
      tick,
      showModal,
      options,
      checkAnswer,
      selectedNumber,
      firstLaunch,
      LANGUAGE,
      videoId,
      setProp,
    },
  } = useStores()

  useEffect(() => {
    const timer = setInterval(tick, 1000)
    firstLaunch()
    return () => clearInterval(timer)
  }, [videoId])

  const { right, left, bottom } = useSafeAreaInsets()
  return (
    <Modal visible={showModal} supportedOrientations={["landscape"]} statusBarTranslucent>
      {!videoId && (
        <Header
          leftIcon="back"
          safeAreaEdges={["left"]}
          onLeftPress={() => {
            navigationRef.navigate("Welcome")
            setProp("showModal", false)
          }}
        />
      )}
      <View style={[styles.container, { paddingLeft: left, paddingRight: right }]}>
        {options.map((option) => {
          const color =
            option === selectedNumber
              ? selectedNumber === number
                ? "green"
                : "red"
              : "transparent"
          return (
            <WordItem
              disabled={selectedNumber !== null}
              borderColor={color}
              key={String(option)}
              onPress={() => {
                checkAnswer(option)
              }}
              word={words[option]}
            />
          )
        })}
      </View>
      <TouchableOpacity
        style={[styles.soundButton, { right: right + 10, bottom: bottom + 10 }]}
        onPress={() => {
          playSound(number, LANGUAGE === "vi")
        }}
      >
        <Ionicons name="volume-high" size={40} color="black" />
      </TouchableOpacity>
    </Modal>
  )
})

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  soundButton: {
    bottom: 0,
    position: "absolute",
    right: 0,
  },
  text: {
    color: colors.text,
    fontSize: 200,
  },
})
