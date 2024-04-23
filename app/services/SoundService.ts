import { Word } from "@models/Database"
import { AVPlaybackSource, Audio } from "expo-av"
import { getSingleGif } from "./CacheManager"

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
    } else {
      const uri = await getSingleGif(vi ? "vi" : "en", name.dashEn, "wav")
      soundFile = { uri }
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

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
