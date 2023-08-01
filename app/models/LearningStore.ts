import { Instance, SnapshotIn, SnapshotOut, cast, flow, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import lodash from "lodash"
import { addMinutes } from "date-fns"
import { EffectSound, playSound, sleep } from "@services/SoundService"
const MAX_NUMBER = 113
const MAX_NUMBER_NUMBER = 10
const allNumbers = Array(MAX_NUMBER)
  .fill(0)
  .map((_, i) => i)
const MAX_OPTIONS = 4
const MAX_CORRECT = 3

export const LearningStoreModel = types
  .model("LearningStore")
  .props({
    selectedNumber: types.maybeNull(types.number),
    options: types.optional(types.array(types.number), [0]),
    number: 0,
    maxNumber: 3,
    correctArray: types.optional(types.array(types.number), Array(MAX_NUMBER).fill(0)),
    // options: types.optional(types.array(types.number), [10]),
    // number: 10,
    // maxNumber: 13,
    // correctArray: types.optional(
    //   types.array(types.number),
    //   Array(MAX_NUMBER)
    //     .fill(0)
    //     .map((_, i) => (i < 10 ? MAX_CORRECT : 0)),
    // ),
    learnCount: 0,
    nextLearn: types.optional(types.Date, new Date(0)),
    now: types.optional(types.Date, new Date()),
    showModal: false,
    LEARN_PER_TURN: 5,
    MINUTE_PER_TURN: 1,
    videoId: "",
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    checkAnswer: flow(function* (number: number) {
      self.selectedNumber = number
      if (number === self.number) {
        if (number >= 10) {
          playSound(self.number, true)
        } else {
          playSound(<EffectSound>["dung1", "dung2"][self.learnCount % 2])
        }
        yield sleep(2000)
        self.learnCount++
        self.correctArray[self.number]++
      } else {
        playSound(<EffectSound>["sai1", "sai2"][self.learnCount % 2])
        yield sleep(2000)
        self.learnCount -= 0.5
        self.correctArray[self.number] = Math.max(0, self.correctArray[self.number] - 1)
        self.correctArray[self.selectedNumber] = Math.max(
          0,
          self.correctArray[self.selectedNumber] - 1,
        )
      }
      let newNumber
      do {
        newNumber = lodash(allNumbers)
          .filter(
            (i) => i < self.maxNumber && self.correctArray[i] < MAX_CORRECT && i !== self.number,
          )
          .shuffle()
          .first()
        if (newNumber === undefined) {
          if (self.correctArray.filter((i) => i < MAX_CORRECT).length === 0) {
            self.correctArray = cast(Array(MAX_NUMBER).fill(0))
            self.maxNumber = 2
          } else {
            self.maxNumber++
          }
        } else {
          self.number = newNumber
          self.selectedNumber = null
        }
      } while (newNumber === undefined)
      self.options = cast(
        lodash(allNumbers)
          .filter(
            (i) => i < self.maxNumber && i !== self.number && (self.number < 10 ? i < 10 : i >= 10),
          )
          .shuffle()
          .take(Math.min(self.correctArray[self.number] + 1, MAX_OPTIONS - 1))
          .push(self.number)
          .shuffle()
          .value(),
      )
      if (self.learnCount >= self.LEARN_PER_TURN) {
        self.learnCount = 0
        self.nextLearn = addMinutes(new Date(), self.MINUTE_PER_TURN)
        self.showModal = false
      } else {
        playSound(self.number)
      }
    }),
    tick() {
      self.now = new Date()
      if (!self.showModal && self.nextLearn < self.now) {
        self.showModal = true
        playSound(self.number)
      }
    },
    firstLaunch() {
      playSound(self.number)
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface LearningStore extends Instance<typeof LearningStoreModel> {}
export interface LearningStoreSnapshotOut extends SnapshotOut<typeof LearningStoreModel> {}
export interface LearningStoreSnapshotIn extends SnapshotIn<typeof LearningStoreModel> {}
export const createLearningStoreDefaultModel = () => types.optional(LearningStoreModel, {})
