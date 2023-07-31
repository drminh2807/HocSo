import React, { useEffect } from "react"
import { Modal, StyleSheet, TouchableOpacity, View, Text as RNText } from "react-native"
import { observer } from "mobx-react-lite"
import { colors } from "@theme/colors"
import { useStores } from "@models"

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

  return (
    <Modal visible={showModal} supportedOrientations={["landscape"]} statusBarTranslucent>
      <View style={styles.container}>
        {options.map((option) => (
          <TouchableOpacity
            disabled={selectedNumber !== null}
            key={String(option)}
            onPress={() => {
              checkAnswer(option)
            }}
          >
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
          </TouchableOpacity>
        ))}
      </View>
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
  text: {
    color: colors.text,
    fontSize: 200,
  },
})
