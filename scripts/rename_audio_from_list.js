const input = `/Users/minhdv/Downloads/raw_chris`
const output = `/Users/minhdv/Downloads/chris`
const wordListPath = "./word_list.csv"
const fs = require("fs")
const wordListFile = fs.readFileSync(wordListPath, "utf8")

wordListFile.split("\n").forEach((line, index) => {
  const comps = line.split("\t")
  const word = comps[1].replace(/\s+/g, '-')
  const audio = index < 9 ? `0${index + 1}` : `${index + 1}`
  fs.copyFileSync(`${input}/${audio}.wav`, `${output}/${word}.wav`)
})
console.log("Done")
