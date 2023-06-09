import { Audio } from "expo-av"
// import Sound from "react-native-sound"

export type EffectSound = "dung1" | "dung2" | "sai2" | "sai1"

type SoundName = EffectSound | number
const allSounds: Record<SoundName, number> = {
  0: require("../../assets/audio/0.wav"),
  1: require("../../assets/audio/1.wav"),
  2: require("../../assets/audio/2.wav"),
  3: require("../../assets/audio/3.wav"),
  4: require("../../assets/audio/4.wav"),
  5: require("../../assets/audio/5.wav"),
  6: require("../../assets/audio/6.wav"),
  7: require("../../assets/audio/7.wav"),
  8: require("../../assets/audio/8.wav"),
  9: require("../../assets/audio/9.wav"),
  dung1: require("../../assets/audio/dung1.wav"),
  dung2: require("../../assets/audio/dung2.wav"),
  sai1: require("../../assets/audio/sai1.wav"),
  sai2: require("../../assets/audio/sai2.wav"),
}
let sound: Audio.SoundObject
export const playSound = async (name: SoundName) => {
  try {
    await sound.sound.stopAsync()
  } catch (error) {}
  try {
    await Audio.Sound.createAsync(allSounds[name], { shouldPlay: true })
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
