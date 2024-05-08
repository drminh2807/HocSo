const { initializeApp, cert } = require("firebase-admin/app")
const { getStorage } = require("firebase-admin/storage")

const serviceAccount = require("/Users/minhdv/hocsochobe.json")

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "hocsochobe.appspot.com",
})

const bucket = getStorage().bucket()

const fs = require("fs")
const main = async () => {
  const wordListPath = "./word_list.csv"
  const wordListFile = fs.readFileSync(wordListPath, "utf8")
  const [files] = await bucket.getFiles()
  const fileNames = files.map((file) => file.name)
  wordListFile.split("\n").forEach((line) => {
    const [category, en, vi] = line.split("\t")
    const dashEn = en.replace(/\s+/g, "-")
    const existVi = fileNames.includes(`en_chris/${dashEn}.wav`)
    if (!existVi) {
      console.log(`${category};${en}`)
    }
  })
  console.log("Done")
}
// 'bucket' is an object defined in the @google-cloud/storage library.
// See https://googlecloudplatform.github.io/google-cloud-node/#/docs/storage/latest/storage/bucket
// for more details.
main()