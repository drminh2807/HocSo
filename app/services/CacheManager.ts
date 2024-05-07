import * as FileSystem from "expo-file-system"

const cacheDir = FileSystem.cacheDirectory + "audio"
const audioDir = (folder: string) => cacheDir + "/" + folder

const audioFileUri = (folder: string, name: string, extension: string) =>
  audioDir(folder) + "/" + name + "." + extension

export const audioUrl = (folder: string, name: string, extension: string) =>
  `https://firebasestorage.googleapis.com/v0/b/hocsochobe.appspot.com/o/${folder}%2F${name}.${extension}?alt=media`

// Checks if audio directory exists. If not, creates it
async function ensureDirExists(folder: string) {
  const dirInfo = await FileSystem.getInfoAsync(audioDir(folder))
  if (!dirInfo.exists) {
    console.log("Audio directory doesn't exist, creating…")
    await FileSystem.makeDirectoryAsync(audioDir(folder), { intermediates: true })
  }
}

// Returns URI to our local audio file
// If our audio doesn't exist locally, it downloads it
export async function getSingleAudio(folder: string, name: string, extension: string) {
  await ensureDirExists(folder)

  const fileUri = audioFileUri(folder, name, extension)
  const fileInfo = await FileSystem.getInfoAsync(fileUri)

  if (!fileInfo.exists) {
    console.log("Audio isn't cached locally. Downloading…")
    await FileSystem.downloadAsync(audioUrl(folder, name, extension), fileUri)
  }

  return fileUri
}

export const clearCache = () => FileSystem.deleteAsync(cacheDir)
