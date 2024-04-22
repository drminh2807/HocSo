import { words } from "@models/Database"
import { AVPlaybackSource, Audio } from "expo-av"

export type EffectSound = "dung1" | "dung2" | "sai1"

const allSounds: Record<EffectSound, number> = {
  dung1: require("assets/audio/dung1.wav"),
  dung2: require("assets/audio/dung2.wav"),
  sai1: require("assets/audio/sai1.wav"),
}
export const playSound = async (name: EffectSound | number, vi = false) => {
  try {
    let soundFile: AVPlaybackSource
    if (typeof name === "number") {
      if (vi) {
        soundFile = words[name].viSound
      } else {
        soundFile = words[name].enSound
      }
    } else {
      soundFile = allSounds[name]
    }
    const { sound } = await Audio.Sound.createAsync(soundFile, { shouldPlay: true }, (status) => {
      if ("didJustFinish" in status && status.didJustFinish) {
        sound.unloadAsync()
      }
    })
  } catch (error) {
    console.log("Play sound error", error)
  }
}
// let sound: Audio.SoundObject
// export const playSound = async (name: SoundName) =>
//   new Promise<void>((resolve, reject) => {
//     const sound = new Sound(name + ".wav", Sound.MAIN_BUNDLE, (error) => {
//       if (error) {
//         console.log("failed to load the sound", error)
//         reject(error)
//         return
//       }
//       sound.play((success) => {
//         if (success) {
//           console.log("successfully finished playing")
//         } else {
//           console.log("playback failed due to audio decoding errors")
//         }
//         sound.release()
//         resolve()
//       })
//     })
//   })

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
