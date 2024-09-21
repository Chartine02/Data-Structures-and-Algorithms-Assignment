const fs = require("fs");
const path = require("path");

class CustomSet {
  constructor() {
    this.items = {};
  }

  add(item) {
    if (!this.items[item]) {
      this.items[item] = true;
      return true;
    }
    return false;
  }

  values() {
    return Object.keys(this.items).map(Number);
  }
}

class UniqueInt {
  constructor(inputFilePath, outputFilePath) {
    this.inputFilePath = inputFilePath;
    this.outputFilePath = outputFilePath;
    this.uniqueIntegers = new CustomSet();
  }

  processFile() {
    this.readFile(this.inputFilePath, (error, data) => {
      if (error) {
        console.error("Error reading input file:", error);
        return;
      }
      const lines = this.splitLines(data);
      lines.forEach((line) => this.processLine(line));
      this.writeToFile();
    });
  }

  readFile(filePath, callback) {
    fs.readFile(filePath, "utf8", callback);
  }

  splitLines(data) {
    return data.split(/\r?\n/);
  }

  processLine(line) {
    const trimmedLine = this.trim(line);
    if (trimmedLine === "") return;

    const parsedInt = this.parseInt(trimmedLine);
    if (parsedInt !== null && !this.containsWhitespace(trimmedLine)) {
      this.uniqueIntegers.add(parsedInt);
    }
  }

  trim(str) {
    return str.replace(/^\s+|\s+$/g, "");
  }

  parseInt(str) {
    const num = Number(str);
    return Number.isInteger(num) ? num : null;
  }

  containsWhitespace(str) {
    return /\s/.test(str);
  }

  writeToFile() {
    const sortedUniqueIntegers = this.customSort(this.uniqueIntegers.values());
    const outputData = sortedUniqueIntegers.join("\n") + "\n";

    fs.writeFile(this.outputFilePath, outputData, "utf8", (error) => {
      if (error) {
        console.error("Error writing output file:", error);
      } else {
        console.log(`File written: ${this.outputFilePath}`);
      }
    });
  }

  customSort(arr) {
    if (arr.length <= 1) return arr;
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [];
    const right = [];
    const equal = [];

    for (let val of arr) {
      if (val < pivot) {
        left.push(val);
      } else if (val > pivot) {
        right.push(val);
      } else {
        equal.push(val);
      }
    }

    return [...this.customSort(left), ...equal, ...this.customSort(right)];
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
