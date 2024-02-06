/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import React, { FC, useEffect } from "react"
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native"
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
import useScreenScale from "@utils/useScreenScale"

export interface LearningModalProps {}

interface BorderButtonProps {
  onPress?: () => void
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
  disabled?: boolean
}
const BorderButton: FC<BorderButtonProps> = ({ onPress, children, style, disabled }) => {
  const { hScale, wScale } = useScreenScale()
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.button,
        {
          borderWidth: hScale(3),
          padding: hScale(8),
          borderRadius: hScale(8),
          minWidth: wScale(250),
        },
        style,
      ]}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  )
}

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
      shouldLearnViToEn,
      disableUI,
      showingResult,
    },
  } = useStores()

  useEffect(() => {
    const timer = setInterval(tick, 1000)
    firstLaunch()
    return () => clearInterval(timer)
  }, [videoId])

  const { right, left, bottom } = useSafeAreaInsets()
  const { hScale, scale } = useScreenScale()
  if (!showModal) return null

  const renderEnText = (item: number) => {
    return (
      <View style={[styles.item, { padding: hScale(8) }]}>
        <BorderButton
          style={{
            borderColor:
              showingResult && item === number
                ? "green"
                : showingResult && item === selectedNumber
                ? "#FF8080"
                : item === selectedNumber
                ? "#FFCF96"
                : colors.border,
          }}
          disabled={disableUI}
          onPress={() => {
            setProp("selectedNumber", item)
            playSound(item)
          }}
        >
          <Ionicons name="volume-high" size={40} color="black" />
          <Text style={[styles.text, { fontSize: scale(24) }]}>{words[item].en}</Text>
        </BorderButton>
      </View>
    )
  }

  const renderViToEn = () => {
    return (
      <View style={styles.viToEnContainer}>
        <WordItem
          word={words[number]}
          borderColor="white"
          disabled={disableUI}
          onPress={() => playSound(number, true)}
        />
        <View style={styles.row}>
          {renderEnText(options[0])}
          {renderEnText(options[1])}
        </View>
        <View style={styles.row}>
          {renderEnText(options[2])}
          {renderEnText(options[3])}
        </View>
        {selectedNumber !== null ? (
          <BorderButton
            disabled={disableUI}
            style={styles.checkButton}
            onPress={() => {
              checkAnswer(selectedNumber)
            }}
          >
            <Ionicons name="checkmark" size={40} />
          </BorderButton>
        ) : null}
      </View>
    )
  }

  const renderEnToVi = () => {
    return (
      <View style={styles.enToViContainer}>
        {options.map((option) => {
          const color =
            option === selectedNumber
              ? selectedNumber === number
                ? "green"
                : "red"
              : "transparent"
          return (
            <WordItem
              disabled={selectedNumber !== null || disableUI}
              borderColor={color}
              key={String(option)}
              onPress={() => {
                checkAnswer(option)
              }}
              word={words[option]}
            />
          )
        })}
        <TouchableOpacity
          style={[styles.soundButton, { right: 10, bottom: 10 }]}
          disabled={disableUI}
          onPress={() => {
            playSound(number, LANGUAGE === "vi")
          }}
        >
          <Ionicons name="volume-high" size={40} color="black" />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={StyleSheet.absoluteFill}>
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
        {shouldLearnViToEn ? renderViToEn() : renderEnToVi()}
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderColor: colors.border,
    flexDirection: "row",
  },
  checkButton: {
    alignItems: "center",
    backgroundColor: "#CDFADB",
    justifyContent: "center",
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  enToViContainer: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  item: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
  },
  soundButton: {
    bottom: 0,
    position: "absolute",
    right: 0,
  },
  text: {
    fontWeight: "bold",
    marginLeft: 16,
    textAlign: "center",
  },
  viToEnContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
})
