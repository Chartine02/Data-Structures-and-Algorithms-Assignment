const fs = require("fs");
const readline = require("readline");

class SparseMatrix {
  constructor(filePath = null, numRows = null, numCols = null) {
    this.rows = numRows;
    this.cols = numCols;
    this.data = new Map();

    if (filePath) {
      this.readFromFile(filePath);
    }
  }

  readFromFile(filePath) {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length < 2) {
      throw new Error("Input file has wrong format");
    }

    const parseHeaderLine = (line, prefix) => {
      if (line.startsWith(prefix)) {
        const value = parseInt(line.slice(prefix.length));
        if (!isNaN(value)) return value;
      }
      throw new Error("Input file has wrong format");
    };

    this.rows = parseHeaderLine(lines[0], "rows=");
    this.cols = parseHeaderLine(lines[1], "cols=");

    for (let i = 2; i < lines.length; i++) {
      const line = lines[i];
      if (line[0] !== "(" || line[line.length - 1] !== ")") {
        throw new Error("Input file has wrong format");
      }
      const parts = line
        .slice(1, -1)
        .split(",")
        .map((part) => part.trim());
      if (parts.length !== 3) {
        throw new Error("Input file has wrong format");
      }
      const [row, col, value] = parts.map(Number);
      if (isNaN(row) || isNaN(col) || isNaN(value)) {
        throw new Error("Input file has wrong format");
      }
      this.setElement(row, col, value);
    }
  }

  getElement(currRow, currCol) {
    return this.data.get(`${currRow},${currCol}`) || 0;
  }

  setElement(currRow, currCol, value) {
    if (value === 0) {
      this.data.delete(`${currRow},${currCol}`);
    } else {
      this.data.set(`${currRow},${currCol}`, value);
    }
  }

  add(matrix) {
    if (this.rows !== matrix.rows || this.cols !== matrix.cols) {
      throw new Error("Matrix dimensions must match for addition");
    }
    const result = new SparseMatrix(null, this.rows, this.cols);
    this.data.forEach((value, key) => {
      const [row, col] = key.split(",").map(Number);
      result.setElement(row, col, value + matrix.getElement(row, col));
    });
    matrix.data.forEach((value, key) => {
      if (!this.data.has(key)) {
        const [row, col] = key.split(",").map(Number);
        result.setElement(row, col, value);
      }
    });
    return result;
  }

  subtract(matrix) {
    if (this.rows !== matrix.rows || this.cols !== matrix.cols) {
      throw new Error("Matrix dimensions must match for subtraction");
    }
    const result = new SparseMatrix(null, this.rows, this.cols);
    this.data.forEach((value, key) => {
      const [row, col] = key.split(",").map(Number);
      result.setElement(row, col, value - matrix.getElement(row, col));
    });
    matrix.data.forEach((value, key) => {
      if (!this.data.has(key)) {
        const [row, col] = key.split(",").map(Number);
        result.setElement(row, col, -value);
      }
    });
    return result;
  }

  multiply(matrix) {
    if (this.cols !== matrix.rows) {
      throw new Error(
        "Number of columns in the first matrix must equal the number of rows in the second matrix for multiplication"
      );
    }
    const result = new SparseMatrix(null, this.rows, matrix.cols);
    this.data.forEach((valueA, keyA) => {
      const [rowA, colA] = keyA.split(",").map(Number);
      for (let colB = 0; colB < matrix.cols; colB++) {
        const valueB = matrix.getElement(colA, colB);
        if (valueB !== 0) {
          const currentValue = result.getElement(rowA, colB);
          result.setElement(rowA, colB, currentValue + valueA * valueB);
        }
      }
    });
    return result;
  }

  toString() {
    let result = `rows=${this.rows}\ncols=${this.cols}\n`;
    this.data.forEach((value, key) => {
      const [row, col] = key.split(",");
      result += `(${row}, ${col}, ${value})\n`;
    });
    return result.trim();
  }
}

function writeMatrixToFile(matrix, filePath) {
  const content = matrix.toString();
  fs.writeFileSync(filePath, content, "utf-8");
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getUserInput(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  try {
    console.log("Select the matrix operation:");
    console.log("1. Addition");
    console.log("2. Subtraction");
    console.log("3. Multiplication");
    const choice = await getUserInput("Enter your choice (1/2/3): ");

    const matrixAPath = await getUserInput(
      "Enter the file path for matrix A: "
    );
    const matrixBPath = await getUserInput(
      "Enter the file path for matrix B: "
    );

    const matrixA = new SparseMatrix(matrixAPath);
    const matrixB = new SparseMatrix(matrixBPath);

    let result;
    let operationName;

    switch (choice) {
      case "1":
        result = matrixA.add(matrixB);
        operationName = "addition";
        break;
      case "2":
        result = matrixA.subtract(matrixB);
        operationName = "subtraction";
        break;
      case "3":
        result = matrixA.multiply(matrixB);
        operationName = "multiplication";
        break;
      default:
        throw new Error("Invalid choice");
    }

    const outputPath = await getUserInput("Enter the output file path: ");
    writeMatrixToFile(result, outputPath);
    console.log(
      `Matrix ${operationName} completed successfully. Result written to ${outputPath}`
    );
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    rl.close();
  }
}

main();

//To test the code, run the command "node app.js" in the terminal.
// choose the operation you want to perform
// enter the file path for matrix A e.g: ./input_files/easy_sample_1.txt
// enter the file path for matrix B e.g: ./input_files/easy_sample_2.txt
// enter the output file path eg: ./output_files/output.txt
