import * as FileSystem from "expo-file-system"

const cacheDir = FileSystem.cacheDirectory + "audio"
const gifDir = (folder: string) => cacheDir + "/" + folder

const gifFileUri = (folder: string, name: string, extension: string) =>
  gifDir(folder) + "/" + name + "." + extension

const gifUrl = (folder: string, name: string, extension: string) =>
  `https://firebasestorage.googleapis.com/v0/b/hocsochobe.appspot.com/o/${folder}%2F${name}.${extension}?alt=media`

// Checks if gif directory exists. If not, creates it
async function ensureDirExists(folder: string) {
  const dirInfo = await FileSystem.getInfoAsync(gifDir(folder))
  if (!dirInfo.exists) {
    console.log("Gif directory doesn't exist, creating…")
    await FileSystem.makeDirectoryAsync(gifDir(folder), { intermediates: true })
  }
}

// Returns URI to our local gif file
// If our gif doesn't exist locally, it downloads it
export async function getSingleGif(folder: string, name: string, extension: string) {
  await ensureDirExists(folder)

  const fileUri = gifFileUri(folder, name, extension)
  const fileInfo = await FileSystem.getInfoAsync(fileUri)

  if (!fileInfo.exists) {
    console.log("Gif isn't cached locally. Downloading…")
    await FileSystem.downloadAsync(gifUrl(folder, name, extension), fileUri)
  }

  return fileUri
}

export const clearCache = () => FileSystem.deleteAsync(cacheDir)
