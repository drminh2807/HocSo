import * as React from "react"
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import Modal from "react-native-modal"
import { useStores } from "@models/index"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Text } from "./Text"

export interface TodayLockModalProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const TodayLockModal = observer(function TodayLockModal(_: TodayLockModalProps) {
  const {
    learningStore: { isShowingLock, hideLock },
  } = useStores()
  const { width, height } = useWindowDimensions()
  return (
    <Modal
      isVisible={isShowingLock}
      onBackButtonPress={hideLock}
      onBackdropPress={hideLock}
      deviceWidth={width}
      deviceHeight={height}
      style={{ margin: 0, alignItems: "center", justifyContent: "center" }}
    >
      <View style={styles.container}>
        <Ionicons name="lock-closed" color="black" size={100} />
        <Text style={styles.text}>
          Hết giờ học hôm nay rồi!{"\n"}Con quay lại học vào ngày mai nhé!
        </Text>
      </View>
    </Modal>
  )
})

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 16,
    justifyContent: "center",
    padding: 16,
  },
  text: {
    color: colors.palette.primary500,
    fontFamily: typography.primary.normal,
    fontSize: 18,
    textAlign: "center",
  },
})
