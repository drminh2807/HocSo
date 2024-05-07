import { Word } from "@models/Database"
import { AVPlaybackSource, Audio } from "expo-av"
import { audioUrl, getSingleAudio } from "./CacheManager"
import { Sound } from "expo-av/build/Audio"
import { Platform } from "react-native"

export type EffectSound = "dung1" | "dung2" | "sai1"

const allSounds: Record<EffectSound, number> = {
  dung1: require("assets/audio/dung1.wav"),
  dung2: require("assets/audio/dung2.wav"),
  sai1: require("assets/audio/sai1.wav"),
}
export const playSound = async (name: EffectSound | Word, vi = false) => {
  try {
    let soundFile: AVPlaybackSource
    if (typeof name === "string") {
      soundFile = allSounds[name]
    } else if (Platform.OS === "web") {
      const uri = audioUrl(vi ? "vi" : "en", name.dashEn, "wav")
      soundFile = { uri }
    } else {
      const uri = await getSingleAudio(vi ? "vi" : "en", name.dashEn, "wav")
      soundFile = { uri }
    }
    return new Promise<void>((resolve, reject) => {
      let sound: Sound
      Audio.Sound.createAsync(soundFile, { shouldPlay: true }, (status) => {
        if ("didJustFinish" in status && status.didJustFinish) {
          sound.unloadAsync()
          resolve()
        }
      })
        .then((result) => {
          sound = result.sound
        })
        .catch(reject)
    })
  } catch (error) {
    console.log("Play sound error", error)
  }
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
