import AsyncStorage from "@react-native-async-storage/async-storage"
import { words } from "./Database"

interface Progress {
  level: number
  index: number
}

const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584]

export var progressArray: Progress[] = []

const PROGRESS_KEY = "PROGRESS_KEY"

export const saveProgress = async () =>
  AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progressArray))

export const clearProgress = () => {
  progressArray = Array.from({ length: words.length }, (_, index) => ({ level: 0, index }))
  return saveProgress()
}

export const loadProgress = async () => {
  const raw = await AsyncStorage.getItem(PROGRESS_KEY)
  if (raw) {
    progressArray = JSON.parse(raw) as Progress[]
  } else {
    return clearProgress()
  }
}

export const updateProgress = (correct: boolean) => {
  const word = progressArray.shift()
  if (word) {
    word.level = correct ? word.level + 1 : 1
    const pos = Math.min(progressArray.length - 1, FIBONACCI[word.level])
    progressArray.splice(pos, 0, word)
  }
  saveProgress()
}
