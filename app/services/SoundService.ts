import { Audio } from "expo-av"
// import Sound from "react-native-sound"

export type EffectSound = "dung1" | "dung2" | "sai2" | "sai1"

type SoundName = EffectSound | number
const allSounds: Record<SoundName, string> = {
  0: "https://vbee-studio-1.s3.ap-southeast-1.amazonaws.com/synthesis/2023/06/06/0_060623225236.wav",
  1: "https://vbee-studio-1.s3.ap-southeast-1.amazonaws.com/synthesis/2023/06/06/mot_060623113134.wav",
  2: "https://vbee-studio-1.s3.ap-southeast-1.amazonaws.com/synthesis/2023/06/06/2_060623190036.wav",
  3: "https://vbee-studio-1.s3.ap-southeast-1.amazonaws.com/synthesis/2023/06/06/3_060623190040.wav",
  4: "https://vbee-studio-1.s3.ap-southeast-1.amazonaws.com/synthesis/2023/06/06/4_060623120100.wav",
  5: "https://vbee-studio-1.s3.ap-southeast-1.amazonaws.com/synthesis/2023/06/06/5_060623190227.wav",
  6: "https://vbee-studio-1.s3.ap-southeast-1.amazonaws.com/synthesis/2023/06/06/6_060623190243.wav",
  7: "https://vbee-studio-1.s3.ap-southeast-1.amazonaws.com/synthesis/2023/06/06/7_060623192000.wav",
  8: "https://vbee-studio-1.s3.ap-southeast-1.amazonaws.com/synthesis/2023/06/06/8_060623192019.wav",
  9: "https://vbee-studio-1.s3.ap-southeast-1.amazonaws.com/synthesis/2023/06/06/9_060623192042.wav",
  dung1:
    "https://vbee-studio-1.s3.ap-southeast-1.amazonaws.com/synthesis/2023/06/06/dung1_060623122140.wav",
  dung2:
    "https://vbee-studio-1.s3.ap-southeast-1.amazonaws.com/synthesis/2023/06/06/dung2_060623192303.wav",
  sai1: "https://vbee-studio-1.s3.ap-southeast-1.amazonaws.com/synthesis/2023/06/06/sai1_060623192336.wav",
  sai2: "https://vbee-studio-1.s3.ap-southeast-1.amazonaws.com/synthesis/2023/06/06/sai2_060623192424.wav",
}
let sound: Audio.SoundObject
export const playSound = async (name: SoundName) => {
  try {
    await sound.sound.stopAsync()
  } catch (error) {}
  try {
    await Audio.Sound.createAsync({ uri: allSounds[name] }, { shouldPlay: true })
  } catch (error) {}
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
