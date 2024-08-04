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
import { addSeconds, isToday } from "date-fns"
import { EffectSound, playSound, sleep } from "@services/SoundService"
import { words } from "./Database"
import { navigate } from "@navigators/navigationUtilities"
import { progressArray, updateProgress } from "./ProgressContext"

const MAX_OPTIONS = 4
export const ProgressModel = types.model("ProgressModel").props({
  level: 0,
  index: 0,
})

export const LearningStoreModel = types
  .model("LearningStore")
  .props({
    selectedNumber: types.maybeNull(types.number),
    options: types.optional(types.array(types.number), [0]),
    learningWordIndex: 0,
    learningWordLevel: 0,
    newWordCount: 1,
    learningWordCount: 0,
    expertWordCount: 0,
    learnCount: 0,
    nextLearn: types.optional(types.Date, new Date(0)),
    now: types.optional(types.Date, new Date()),
    showModal: false,
    LEARN_PER_TURN: 5,
    MINUTE_PER_TURN: 1,
    MINUTE_PER_DAY: 60,
    LANGUAGE: "en",
    minutesToday: 0,
    lastLock: types.optional(types.Date, new Date(0)),
    lastMinuteToday: types.optional(types.Date, new Date(0)),
    videoId: "",
    disableUI: false,
    showingResult: false,
    isShowingLock: false,
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get learningWord() {
      return words[self.learningWordIndex]
    },
    get shouldLearnViToEn() {
      return self.learningWordLevel % 2 === 1
    },
  }))
  .actions((self) => ({
    shouldLockElseUnlock() {
      const shouldLock = isToday(self.lastLock)
      if (shouldLock && self.minutesToday >= self.MINUTE_PER_DAY) {
        self.lastLock = new Date(0)
        self.minutesToday = 0
        return false
      }
      return shouldLock
    },
    showcase: flow(function* () {
      if (self.shouldLearnViToEn) {
        try {
          self.disableUI = true
          yield playSound(self.learningWord, true)
          yield sleep(500)
          for (const element of self.options) {
            self.selectedNumber = element
            yield playSound(words[element], false)
            yield sleep(500)
          }
        } catch (error) {}
        self.selectedNumber = null
        self.disableUI = false
      } else {
        yield playSound(self.learningWord, self.LANGUAGE === "vi")
      }
    }),
    showLock() {
      self.isShowingLock = true
      playSound("end")
    },
    hideLock() {
      self.isShowingLock = false
    },
  }))
  .actions((self) => ({
    checkAnswer: flow(function* (number: number) {
      self.disableUI = true
      self.selectedNumber = number
      self.showingResult = true
      if (number === self.learningWordIndex) {
        if (self.LANGUAGE === "en") {
          if (self.shouldLearnViToEn) {
            yield playSound(<EffectSound>["dung1", "dung2"][self.learnCount % 2])
            yield sleep(500)
            yield playSound(words[number], true)
            yield sleep(500)
            yield playSound(words[number], false)
          } else {
            yield playSound(self.learningWord, true)
          }
        } else {
          yield playSound(<EffectSound>["dung1", "dung2"][self.learnCount % 2])
        }
        yield sleep(1000)
        self.learnCount++
        updateProgress(true)
      } else {
        yield playSound("sai1")
        if (self.shouldLearnViToEn) {
          yield playSound(self.learningWord, true)
          yield playSound(self.learningWord, false)
        } else {
          yield sleep(2000)
        }
        self.learnCount -= 0.5
        updateProgress(false)
      }
      self.learningWordIndex = progressArray[0].index
      self.learningWordLevel = progressArray[0].level
      self.newWordCount = progressArray.filter((word) => word.level === 0).length
      self.learningWordCount = progressArray.filter(
        (word) => word.level > 0 && word.level < 5,
      ).length
      self.expertWordCount = progressArray.filter((word) => word.level >= 5).length

      self.showingResult = false
      if (self.learningWordLevel) {
        self.options = cast(
          lodash(
            progressArray
              .filter((item, index) => index > 0 && item.level > 0)
              .map((item) => item.index),
          )
            .shuffle()
            .take(MAX_OPTIONS - 1)
            .push(self.learningWordIndex)
            .shuffle()
            .value(),
        )
      } else {
        self.options = cast([self.learningWordIndex])
      }
      self.selectedNumber = null
      self.disableUI = false
      if (self.learnCount >= self.LEARN_PER_TURN) {
        self.learnCount = 0
        self.nextLearn = addSeconds(new Date(), self.MINUTE_PER_TURN * 60)
        self.showModal = false
      } else {
        yield self.showcase()
      }
      console.log(self.learningWord.en, self.learningWordLevel, self.learningWordIndex)
    }),
    tick: flow(function* () {
      self.now = new Date()
      if (!self.showModal && self.nextLearn < self.now) {
        if (isToday(self.lastMinuteToday)) {
          self.minutesToday += self.MINUTE_PER_TURN
        } else {
          self.lastMinuteToday = new Date()
          self.minutesToday = 0
        }
        if (self.minutesToday > self.MINUTE_PER_DAY) {
          self.lastLock = new Date()
          self.minutesToday = 0
          self.showLock()
          navigate({ name: "Welcome", params: undefined })
        } else {
          self.showModal = true
          yield self.showcase()
        }
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
