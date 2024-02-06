import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { VideoStoreModel } from "./VideoStore"
import { LearningStoreModel } from "./LearningStore"
import { AuthenticationStoreModel } from "./AuthenticationStore" // @demo remove-current-line
import { navigate } from "@navigators/index"

/**
 * A RootStore model.
 */
export const RootStoreModel = types
  .model("RootStore")
  .props({
    videoStore: types.optional(VideoStoreModel, {} as any),
    learningStore: types.optional(LearningStoreModel, {} as any),
    authenticationStore: types.optional(AuthenticationStoreModel, {}), // @demo remove-current-line
  })
  .actions((self) => ({
    playVideo: (videoId: string) => {
      self.videoStore.saveVideo(videoId)
      self.videoStore.pendingVideoId = ""
      self.learningStore.setProp("videoId", videoId)
      navigate({ name: "ParentPass", params: { mode: "player" } })
    },
  }))

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
