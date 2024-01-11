import {
  Instance,
  SnapshotIn,
  SnapshotOut,
  applySnapshot,
  cast,
  flow,
  types,
} from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import lodash from "lodash"
import { addMinutes } from "date-fns"
import { EffectSound, playSound, sleep } from "@services/SoundService"
import { words } from "./Database"

const MAX_OPTIONS = 4
const MAX_CORRECT = __DEV__ ? 2 : 4

export const LearningStoreModel = types
  .model("LearningStore")
  .props({
    selectedNumber: types.maybeNull(types.number),
    options: types.optional(types.array(types.number), [0]),
    number: 0,
    correctArray: types.optional(types.array(types.number), [0]),
    // options: types.optional(types.array(types.number), [10]),
    // number: 10,
    // maxNumber: 13,
    // correctArray: types.optional(
    //   types.array(types.number),
    //   Array(MAX_NUMBER)
    //     .fill(0)
    //     .map((_, i) => (i < 10 ? MAX_CORRECT : 0)),
    // ),
    learnNewWordAt: 4,
    learnCount: 0,
    nextLearn: types.optional(types.Date, new Date(0)),
    now: types.optional(types.Date, new Date()),
    showModal: false,
    LEARN_PER_TURN: 5,
    MINUTE_PER_TURN: 1,
    LANGUAGE: "en",
    videoId: "",
  })
  .actions(withSetPropAction)
  .views((self) => ({
    shouldLearnNewWord: () => {
      const total = self.correctArray.reduce((a, b) => a + b, 0)
      console.log({ total, learnNewWordAt: self.learnNewWordAt, correctArray: self.correctArray })
      return total >= self.learnNewWordAt
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    checkAnswer: flow(function* (number: number) {
      self.selectedNumber = number
      if (number === self.number) {
        if (self.LANGUAGE === "en") {
          playSound(self.number, true)
        } else {
          playSound(<EffectSound>["dung1", "dung2"][self.learnCount % 2])
        }
        yield sleep(2000)
        self.learnCount++
        self.correctArray[self.number]++
      } else {
        playSound("sai1")
        yield sleep(2000)
        self.learnCount -= 0.5
        self.correctArray[self.number] = Math.max(0, self.correctArray[self.number] - 1)
        self.correctArray[self.selectedNumber] = Math.max(
          0,
          self.correctArray[self.selectedNumber] - 1,
        )
      }
      if (self.shouldLearnNewWord()) {
        self.number = self.correctArray.length
        self.learnNewWordAt += MAX_CORRECT
        self.correctArray.push(0)
      } else {
        console.log(2)
        const newNumber = lodash(
          self.correctArray
            .map((item, index) => ({ item, index }))
            .filter((i) => i.item < MAX_CORRECT && i.index !== self.number),
        )
          .shuffle()
          .first()?.index
        if (newNumber === undefined) {
          console.log(3)
          if (self.correctArray.length < words.length) {
            console.log(4)
            self.number = self.correctArray.length
            self.correctArray.push(0)
          } else {
            console.log(5)
            // Reset
            self.correctArray = cast([0])
            self.number = 0
          }
        } else {
          console.log(6)
          self.number = newNumber
        }
      }
      self.selectedNumber = null
      if (self.correctArray[self.number] === 0) {
        console.log(7)
        self.options = cast([self.number])
      } else {
        console.log(8)
        self.options = cast(
          lodash(self.correctArray.map((_, i) => i).filter((i) => i !== self.number))
            .shuffle()
            .take(Math.min(MAX_OPTIONS, self.correctArray.length) - 1)
            .push(self.number)
            .shuffle()
            .value(),
        )
      }
      if (self.learnCount >= self.LEARN_PER_TURN) {
        self.learnCount = 0
        self.nextLearn = addMinutes(new Date(), self.MINUTE_PER_TURN)
        self.showModal = false
      } else {
        playSound(self.number, self.LANGUAGE === "vi")
      }
      console.log(words[self.number].en)
    }),
    tick() {
      self.now = new Date()
      if (!self.showModal && self.nextLearn < self.now) {
        self.showModal = true
        playSound(self.number, self.LANGUAGE === "vi")
      }
    },
    firstLaunch() {
      playSound(self.number, self.LANGUAGE === "vi")
    },
    reset() {
      applySnapshot(self, {})
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface LearningStore extends Instance<typeof LearningStoreModel> {}
export interface LearningStoreSnapshotOut extends SnapshotOut<typeof LearningStoreModel> {}
export interface LearningStoreSnapshotIn extends SnapshotIn<typeof LearningStoreModel> {}
export const createLearningStoreDefaultModel = () => types.optional(LearningStoreModel, {})
