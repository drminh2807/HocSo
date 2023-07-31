import { VideoStoreModel } from "./VideoStore"

test("can be created", () => {
  const instance = VideoStoreModel.create({})

  expect(instance).toBeTruthy()
})
