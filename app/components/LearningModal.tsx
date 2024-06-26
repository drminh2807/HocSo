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
import useScreenScale from "@utils/useScreenScale"
import { navigationRef } from "@navigators/navigationUtilities"

export interface LearningModalProps {
  togglePlay(): void
}

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
export const LearningModal = observer(function LearningModal({ togglePlay }: LearningModalProps) {
  const {
    learningStore: {
      learningWordIndex,
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
      newWordCount,
      expertWordCount,
      learningWordCount,
    },
  } = useStores()

  useEffect(() => {
    const timer = setInterval(tick, 1000)
    firstLaunch()
    return () => clearInterval(timer)
  }, [videoId])

  const { right, left } = useSafeAreaInsets()
  const { hScale, scale } = useScreenScale()
  if (!showModal) return null

  const renderEnText = (item: number) => {
    return (
      <View style={[styles.item, { padding: hScale(8) }]}>
        <BorderButton
          style={{
            borderColor:
              showingResult && item === learningWordIndex
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
            playSound(words[item])
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
          word={words[learningWordIndex]}
          borderColor="white"
          disabled={disableUI}
          onPress={() => playSound(words[learningWordIndex], true)}
        />
        <View style={styles.row}>
          {options.length > 0 ? renderEnText(options[0]) : undefined}
          {options.length > 1 ? renderEnText(options[1]) : undefined}
        </View>
        <View style={styles.row}>
          {options.length > 2 ? renderEnText(options[2]) : undefined}
          {options.length > 3 ? renderEnText(options[3]) : undefined}
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
              ? selectedNumber === learningWordIndex
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
            playSound(words[learningWordIndex], LANGUAGE === "vi")
          }}
        >
          <Ionicons name="volume-high" size={40} color="black" />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.progress}>
        <View style={{ flex: newWordCount, backgroundColor: "#B3E2A7" }} />
        <View style={{ flex: learningWordCount, backgroundColor: "#80B9AD" }} />
        <View style={{ flex: expertWordCount, backgroundColor: "#6295A2" }} />
      </View>
      <Header
        safeAreaEdges={[]}
        leftIcon="back"
        onLeftPress={() => {
          navigationRef.navigate("Welcome")
          setProp("showModal", false)
        }}
        RightActionComponent={
          <TouchableOpacity onPress={togglePlay} style={{ padding: 16 }}>
            <Ionicons name="play" size={24} color="black" />
          </TouchableOpacity>
        }
      />
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
  progress: {
    flexDirection: "row",
    height: 16,
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
