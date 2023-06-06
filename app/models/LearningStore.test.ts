import { LearningStoreModel } from "./LearningStore"

test("can be created", () => {
  const instance = LearningStoreModel.create({})

  expect(instance).toBeTruthy()
})

test("checkAnswer", () => {
  const instance = LearningStoreModel.create({})
  instance.checkAnswer(0)
  expect(instance.correctArray[0]).toBe(1)
  expect(instance.number).toBe(1)

  instance.checkAnswer(1)
  instance.checkAnswer(2)
  expect(instance.number).toBe(0)
})