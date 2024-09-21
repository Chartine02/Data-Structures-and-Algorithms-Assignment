const path = require("path");
const fs = require("fs");

class FileHandler {
  constructor(filePath) {
    this.filePath = filePath;
  }

  // Custom function to read file without promises
  readFileSync() {
    try {
      return fs.readFileSync(this.filePath, "utf-8");
    } catch (error) {
      console.error("Error reading file:", error);
      return null;
    }
  }

  // Custom function to write file without promises
  writeFileSync(data) {
    try {
      fs.writeFileSync(this.filePath, data, "utf-8");
      console.log(`File written: ${this.filePath}`);
    } catch (error) {
      console.error("Error writing file:", error);
    }
  }
}

class UniqueIntProcessor {
  constructor() {
    this.uniqueIntegers = [];
  }

  // Custom function to check if an integer is unique
  addUniqueInteger(intValue) {
    for (let i = 0; i < this.uniqueIntegers.length; i++) {
      if (this.uniqueIntegers[i] === intValue) {
        return;
      }
    }
    this.uniqueIntegers.push(intValue);
  }

  // Custom function to parse a line and add unique integers
  processLine(line) {
    const trimmedLine = line.trim();
    if (trimmedLine === "") return;

    const parsedInt = this.parseIntCustom(trimmedLine);
    if (
      parsedInt !== null &&
      !this.containsWhitespace(trimmedLine) &&
      this.isWithinRange(parsedInt)
    ) {
      this.addUniqueInteger(parsedInt);
    }
  }

  // Custom implementation of parseInt
  parseIntCustom(str) {
    let parsed = 0;
    let isNegative = false;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (char === "-" && i === 0) {
        isNegative = true;
      } else if (char >= "0" && char <= "9") {
        parsed = parsed * 10 + (char - "0");
      } else {
        return null; // Return null if it's not a valid number
      }
    }

    return isNegative ? -parsed : parsed;
  }

  // Check if the string contains whitespace
  containsWhitespace(str) {
    for (let i = 0; i < str.length; i++) {
      if (str[i] === " ") return true;
    }
    return false;
  }

  // Check if integer is within the range -1023 to 1023
  isWithinRange(intValue) {
    return intValue >= -1023 && intValue <= 1023;
  }

  // Custom implementation of sorting integers
  sortIntegers(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          // Swap the numbers
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
    return arr;
  }

  // Process all lines
  processData(data) {
    const lines = this.splitByNewline(data);
    for (let i = 0; i < lines.length; i++) {
      this.processLine(lines[i]);
    }
    return this.sortIntegers(this.uniqueIntegers);
  }

  // Custom function to split a string by newlines
  splitByNewline(str) {
    let lines = [];
    let currentLine = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i] === "\n") {
        lines.push(currentLine);
        currentLine = "";
      } else {
        currentLine += str[i];
      }
    }
    lines.push(currentLine);
    return lines;
  }
}

// Usage example

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

const fileHandler = new FileHandler(inputFilePath);
const uniqueIntProcessor = new UniqueIntProcessor();

// Read and process the file
const data = fileHandler.readFileSync();
if (data) {
  const uniqueIntegers = uniqueIntProcessor.processData(data);
  const outputData = uniqueIntegers.join("\n") + "\n";
  fileHandler.filePath = outputFilePath;
  fileHandler.writeFileSync(outputData);
}
