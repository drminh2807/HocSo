/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from "react"
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Text as RNText,
  Image,
  useWindowDimensions,
} from "react-native"
import { observer } from "mobx-react-lite"
import { colors } from "@theme/colors"
import { useStores } from "@models"
import { words } from "@models/Database"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { playSound } from "@services/SoundService"

export interface LearningModalProps {}

/**
 * Describe your component here
 */
export const LearningModal = observer(function LearningModal(_: LearningModalProps) {
  const {
    learningStore: { number, tick, showModal, options, checkAnswer, selectedNumber, firstLaunch },
  } = useStores()

  useEffect(() => {
    const timer = setInterval(tick, 1000)
    firstLaunch()
    return () => clearInterval(timer)
  }, [])

  const { width } = useWindowDimensions()
  const { right, left, bottom } = useSafeAreaInsets()
  return (
    <Modal visible={showModal} supportedOrientations={["landscape"]} statusBarTranslucent>
      <View style={[styles.container, { paddingLeft: left, paddingRight: right }]}>
        {options.map((option) => (
          <TouchableOpacity
            disabled={selectedNumber !== null}
            key={String(option)}
            onPress={() => {
              checkAnswer(option)
            }}
            style={styles.option}
          >
            {option < 10 ? (
              <RNText
                style={[
                  styles.text,
                  // eslint-disable-next-line react-native/no-inline-styles, react-native/no-color-literals
                  {
                    color:
                      option === selectedNumber
                        ? selectedNumber === number
                          ? "green"
                          : "red"
                        : "black",
                  },
                ]}
              >
                {option}
              </RNText>
            ) : (
              <Image
                source={words[option - 10].image}
                resizeMode="contain"
                style={[
                  {
                    width: width * 0.2,
                    height: width * 0.28,
                    borderColor:
                      option === selectedNumber
                        ? selectedNumber === number
                          ? "green"
                          : "red"
                        : "black",
                  },
                  styles.image,
                ]}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.soundButton, { right: right + 10, bottom: bottom + 10 }]}
        onPress={() => {
          playSound(number)
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
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  image: {
    borderWidth: 8,
  },
  option: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
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
