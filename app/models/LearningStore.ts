import { Instance, SnapshotIn, SnapshotOut, cast, flow, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import lodash from "lodash"
import { addMinutes } from "date-fns"
import { EffectSound, playSound, sleep } from "@services/SoundService"

const allNumbers = Array(10)
  .fill(0)
  .map((_, i) => i)
const MAX_OPTIONS = 4

export const LearningStoreModel = types
  .model("LearningStore")
  .props({
    number: 0,
    selectedNumber: types.maybeNull(types.number),
    maxNumber: 3,
    options: types.optional(types.array(types.number), [0]),
    correctArray: types.optional(types.array(types.number), Array(10).fill(0)),
    learnCount: 0,
    nextLearn: types.optional(types.Date, new Date(0)),
    now: types.optional(types.Date, new Date()),
    showModal: false,
    MAX_CORRECT: 5,
    LEARN_PER_TURN: 5,
    MINUTE_PER_TURN: 1,
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    checkAnswer: flow(function* (number: number) {
      self.selectedNumber = number
      if (number === self.number) {
        yield Promise.all([
          sleep(2000),
          playSound(<EffectSound>["dung1", "dung2"][self.learnCount % 2]),
        ])
        self.learnCount++
        self.correctArray[self.number]++
      } else {
        yield Promise.all([
          sleep(2000),
          playSound(<EffectSound>["sai1", "sai2"][self.learnCount % 2]),
        ])
        self.learnCount -= 0.5
        self.correctArray[self.number] = Math.max(0, self.correctArray[self.number] - 1)
      }
      let newNumber
      do {
        const sortedArray = lodash(allNumbers)
          .filter((i) => i < self.maxNumber && self.correctArray[i] < self.MAX_CORRECT)
          .sortBy((a) => self.correctArray[a])
        newNumber = sortedArray.first()
        if (newNumber === undefined) {
          if (self.correctArray.filter((i) => i < self.MAX_CORRECT).length === 0) {
            self.correctArray = cast(Array(10).fill(0))
            self.maxNumber = 2
          } else {
            self.maxNumber += 3
          }
        } else {
          self.number = newNumber
          self.selectedNumber = null
        }
      } while (newNumber === undefined)
      self.options = cast(
        lodash(allNumbers)
          .filter((i) => i < self.maxNumber && i !== self.number)
          .take(Math.min(self.correctArray[self.number], MAX_OPTIONS - 1))
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
