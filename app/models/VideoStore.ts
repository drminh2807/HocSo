import { Instance, SnapshotIn, SnapshotOut, cast, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const VideoStoreModel = types
  .model("VideoStore")
  .props({
    videos: types.optional(types.array(types.string), []),
    pendingVideoId: types.optional(types.string, ""),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    saveVideo: (video: string) => {
      self.videos = cast([...new Set([video, ...self.videos])])
    },
    setPendingVideoId: (videoId: string) => {
      self.pendingVideoId = videoId
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VideoStore extends Instance<typeof VideoStoreModel> {}
export interface VideoStoreSnapshotOut extends SnapshotOut<typeof VideoStoreModel> {}
export interface VideoStoreSnapshotIn extends SnapshotIn<typeof VideoStoreModel> {}
export const createVideoStoreDefaultModel = () => types.optional(VideoStoreModel, {})
