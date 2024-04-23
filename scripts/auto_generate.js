const fs = require("fs")
// Function to generate the words array
function generateWordsArray(category) {
  const folder = `assets/flashcards/${category}`
  return fs
    .readdirSync(folder)
    .filter((e) => e !== ".DS_Store")
    .map((element) => {
      const word = element.split(".")[0]
      return `{ en: "${word}", viSound: require("assets/audio/${category}/vi/${word}.wav"), enSound: require("assets/audio/${category}/en/${word}.wav"), image: require("assets/flashcards/${category}/${word}.jpg"), category: "${category}"  }, `
    })
}
const firstLine =
  "\
export interface Word {\n\
  en: string\n\
  dashEn: string\n\
  vi: string\n\
  category: string\n\
}\n\
\n\
export const words: Word[] = [\n\
"
// Generate the words array
// const generatedWordsArray = categories.map(category => generateWordsArray(category)).reduce((acc, val) => acc.concat(val), []);
const lines = fs.readFileSync("./word_list.csv", "utf8")
const words = lines.split("\n").map((line) => {
  const [category, en, vi] = line.split("\t")
  const dashEn = en.replace(/\s+/g, "-")
  return JSON.stringify({ category, en, vi, dashEn }) + ","
})
const allLines = [firstLine, ...words, "]"].join("\n")
// Save the JSON string to a file
fs.writeFileSync("../app/models/Database.ts", allLines, "utf8")

console.log("Words array generated and saved to 'app/models/Database.ts'")
