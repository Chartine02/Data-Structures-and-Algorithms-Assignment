const fs = require("fs").promises;
const path = require("path");

class UniqueInt {
  constructor(inputFilePath, outputFilePath) {
    this.inputFilePath = inputFilePath;
    this.outputFilePath = outputFilePath;
    this.uniqueIntegers = new Set();
  }

  async processFile() {
    try {
      const data = await fs.readFile(this.inputFilePath, "utf-8");
      const lines = data.split("\n");
      lines.forEach((line) => this.processLine(line));
      this.writeToFile();
    } catch (error) {
      console.error("Error reading input file:", error);
    }
  }

  processLine(line) {
    const trimmedLine = line.trim();
    if (trimmedLine === "") return;

    const parsedInt = parseInt(trimmedLine, 10);
    if (!isNaN(parsedInt) && !trimmedLine.match(/\s/)) {
      this.uniqueIntegers.add(parsedInt);
    }
  }

  async writeToFile() {
    try {
      const sortedUniqueIntegers = [...this.uniqueIntegers].sort(
        (a, b) => a - b
      );
      const outputData = sortedUniqueIntegers.join("\n") + "\n";
      await fs.writeFile(this.outputFilePath, outputData, "utf-8");
      console.log(`File written: ${this.outputFilePath}`);
    } catch (error) {
      console.error("Error writing output file:", error);
    }
  }
}

const inputFilePath = path.join(
  __dirname,
  "sample_inputs",
  "small_sample_input_01.txt"
);
const outputFilePath = path.join(
  __dirname,
  "sample_results",
  "small_sample_input_01.txt_results.txt"
);

const uniqueIntProcessor = new UniqueInt(inputFilePath, outputFilePath);
uniqueIntProcessor.processFile();
