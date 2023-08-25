import { words } from "@models/Database"
import { AVPlaybackSource, Audio } from "expo-av"
import * as Speech from "expo-speech"

export type EffectSound = "dung1" | "dung2" | "sai1"

const allSounds: Record<EffectSound, number> = {
  dung1: require("assets/audio/dung1.wav"),
  dung2: require("assets/audio/dung2.wav"),
  sai1: require("assets/audio/sai1.wav"),
}
let sound: Audio.SoundObject
export const playSound = async (name: EffectSound | number, vi = false) => {
  try {
    await sound.sound.stopAsync()
  } catch (error) {}
  try {
    let soundFile: AVPlaybackSource
    if (typeof name === "number") {
      if (vi) {
        soundFile = words[name].viSound
      } else {
        Speech.speak(words[name].en)
        return
      }
    } else {
      soundFile = allSounds[name]
    }
    sound = await Audio.Sound.createAsync(soundFile, { shouldPlay: true })
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
