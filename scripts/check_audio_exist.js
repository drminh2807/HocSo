const { initializeApp, cert } = require("firebase-admin/app")
const { getStorage } = require("firebase-admin/storage")

const serviceAccount = require("/Users/minh/hocsochobe-firebase-adminsdk-qpowc-eb8e799512.json")

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
    const existVi = fileNames.includes(`vi/${dashEn}.wav`)
    const existAnaEn = fileNames.includes(`en/${dashEn}.wav`)
    const existEn = fileNames.includes(`en/${dashEn}.wav`)
    if (!existEn) {
      console.log(`${dashEn} ${existEn}`)
    }
  })
  console.log("Done")
}
// 'bucket' is an object defined in the @google-cloud/storage library.
// See https://googlecloudplatform.github.io/google-cloud-node/#/docs/storage/latest/storage/bucket
// for more details.
main()