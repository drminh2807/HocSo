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
import { addSeconds } from "date-fns"
import { EffectSound, playSound, sleep } from "@services/SoundService"
import { words } from "./Database"

const MAX_OPTIONS = 4
const MAX_CORRECT = 4

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
    disableUI: false,
    showingResult: false,
  })
  .actions(withSetPropAction)
  .views((self) => ({
    shouldLearnNewWord: () => {
      const total = self.correctArray.reduce((a, b) => a + b, 0)
      return total >= self.learnNewWordAt && self.correctArray.length < words.length
    },
    get shouldLearnViToEn() {
      return [2, 4].includes(self.correctArray[self.number])
    },
  }))
  .actions((self) => ({
    showcase: flow(function* () {
      if (self.shouldLearnViToEn) {
        try {
          self.disableUI = true
          yield playSound(words[self.number], true)
          yield sleep(1000)
          for (const element of self.options) {
            self.selectedNumber = element
            yield playSound(words[element], false)
            yield sleep(1000)
          }
        } catch (error) {}
        self.selectedNumber = null
        self.disableUI = false
      } else {
        playSound(words[self.number], self.LANGUAGE === "vi")
      }
    }),
  }))
  .actions((self) => ({
    checkAnswer: flow(function* (number: number) {
      self.disableUI = true
      self.selectedNumber = number
      self.showingResult = true
      if (number === self.number) {
        if (self.LANGUAGE === "en") {
          if (self.shouldLearnViToEn) {
            yield playSound(<EffectSound>["dung1", "dung2"][self.learnCount % 2])
            yield sleep(1000)
            yield playSound(words[number], true)
            yield sleep(1000)
            yield playSound(words[number], false)
          } else {
            playSound(words[self.number], true)
          }
        } else {
          playSound(<EffectSound>["dung1", "dung2"][self.learnCount % 2])
        }
        yield sleep(1000)
        self.learnCount++
        self.correctArray[self.number]++
      } else {
        playSound("sai1")
        if (self.shouldLearnViToEn) {
          yield sleep(1000)
          yield playSound(words[self.number], true)
          yield sleep(1000)
          yield playSound(words[self.number], false)
          yield sleep(1000)
        } else {
          yield sleep(2000)
        }
        self.learnCount -= 0.5
        self.correctArray[self.number] = Math.max(0, self.correctArray[self.number] - 1)
        self.correctArray[self.selectedNumber] = Math.max(
          0,
          self.correctArray[self.selectedNumber] - 1,
        )
      }
      self.showingResult = false
      if (self.shouldLearnNewWord()) {
        self.number = self.correctArray.length
        self.learnNewWordAt += MAX_CORRECT
        self.correctArray.push(0)
      } else {
        const newNumber = lodash(
          self.correctArray
            .map((item, index) => ({ item, index }))
            .filter((i) => i.item <= MAX_CORRECT && i.index !== self.number),
        )
          .shuffle()
          .first()?.index
        if (newNumber === undefined) {
          if (self.correctArray.length < words.length) {
            self.number = self.correctArray.length
            self.correctArray.push(0)
          } else {
            // Reset
            self.correctArray = cast([0])
            self.number = 0
          }
        } else {
          self.number = newNumber
        }
      }
      self.selectedNumber = null
      if (self.correctArray[self.number] === 0) {
        self.options = cast([self.number])
      } else {
        self.options = cast(
          lodash(self.correctArray.map((_, i) => i).filter((i) => i !== self.number))
            .shuffle()
            .take(Math.min(MAX_OPTIONS, self.correctArray.length) - 1)
            .push(self.number)
            .shuffle()
            .value(),
        )
      }
      self.disableUI = false
      if (self.learnCount >= self.LEARN_PER_TURN) {
        self.learnCount = 0
        self.nextLearn = addSeconds(new Date(), self.MINUTE_PER_TURN * 60)
        self.showModal = false
      } else {
        yield self.showcase()
      }
      console.log(words[self.number].en)
    }),
    tick: flow(function* () {
      self.now = new Date()
      if (!self.showModal && self.nextLearn < self.now) {
        self.showModal = true
        yield self.showcase()
      }
    }),
    firstLaunch() {
      if (self.videoId) {
        self.showModal = false
        self.nextLearn = addSeconds(new Date(), self.MINUTE_PER_TURN)
      } else {
        self.showModal = true
      }
    },
    reset() {
      applySnapshot(self, {})
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface LearningStore extends Instance<typeof LearningStoreModel> {}
export interface LearningStoreSnapshotOut extends SnapshotOut<typeof LearningStoreModel> {}
export interface LearningStoreSnapshotIn extends SnapshotIn<typeof LearningStoreModel> {}
export const createLearningStoreDefaultModel = () => types.optional(LearningStoreModel, {})
