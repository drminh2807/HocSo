import { Word } from "@models/Database"
import { AVPlaybackSource, Audio } from "expo-av"
import { audioUrl, getSingleAudio } from "./CacheManager"
import { Sound } from "expo-av/build/Audio"
import { Platform } from "react-native"
import _ from "lodash"

export type EffectSound = "dung1" | "dung2" | "sai1" | "end"

const allSounds: Record<EffectSound, number> = {
  dung1: require("assets/audio/dung1.wav"),
  end: require("assets/audio/end.mp3"),
  dung2: require("assets/audio/dung2.wav"),
  sai1: require("assets/audio/sai1.wav"),
}

const tryPlayFile = (soundFile: AVPlaybackSource) =>
  new Promise<void>((resolve, reject) => {
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

export const playSound = async (name: EffectSound | Word, vi = false) => {
  try {
    const enFolder = _.sample(["en", "en_ana", "en_chris"]) ?? "en"
    let soundFile: AVPlaybackSource
    if (typeof name === "string") {
      soundFile = allSounds[name]
    } else if (Platform.OS === "web") {
      const uri = audioUrl(vi ? "vi" : enFolder, name.dashEn, "wav")
      soundFile = { uri }
    } else {
      const uri = await getSingleAudio(vi ? "vi" : enFolder, name.dashEn, "wav")
      soundFile = { uri }
    }
    await tryPlayFile(soundFile)
    return true
  } catch (error) {
    console.log(`Play sound "${name?.en}" error`, error)
    return false
  }
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
