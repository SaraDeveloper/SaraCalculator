// Add loading screen functionality
window.addEventListener("load", function () {
  setTimeout(function () {
    const loadingOverlay = document.querySelector(".loading-overlay");
    loadingOverlay.style.opacity = "0";
    setTimeout(function () {
      loadingOverlay.style.display = "none";
    }, 500);
  }, 2000);
});

const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");
const historyLists = document.querySelectorAll(".history-list");
const clearHistoryBtns = document.querySelectorAll(".clear-history");
let currentValue = "";
let operator = "";
let previousValue = "";
let history = [];
let displayOperation = "";

// Keyboard mapping for operators
const operatorMap = {
  '+': '+',
  '-': '-',
  '*': '×',
  'x': '×',
  '/': '÷',
  'Enter': '=',
  '=': '=',
  'Escape': 'C',
  'Delete': 'C',
  'Backspace': 'C',
  '%': '%',
  '.': '.',
  '(': '( )',
  ')': '( )',
  '^': 'xy'
};

let bracketCount = 0;

// Handle keyboard input
document.addEventListener('keydown', (event) => {
  const key = event.key;
  
  // Prevent default behavior for calculator keys
  if ((key >= '0' && key <= '9') || Object.keys(operatorMap).includes(key)) {
    event.preventDefault();
  }

  // Handle numbers
  if (key >= '0' && key <= '9') {
    simulateButtonClick(key);
  }
  // Handle operators and special keys
  else if (operatorMap[key]) {
    simulateButtonClick(operatorMap[key]);
  }
});

// Function to simulate button click
function simulateButtonClick(value) {
  const button = Array.from(buttons).find(btn => {
    // Special handling for exponent button
    if (value === '^' && btn.innerHTML.includes('sup')) return true;
    // Handle xy button specifically
    if (value === 'xy' && btn.innerHTML.includes('sup')) return true;
    return btn.textContent === value;
  });
  if (button) {
    button.click();
    // Add visual feedback
    button.classList.add('active');
    setTimeout(() => {
      button.classList.remove('active');
    }, 100);
  } else {
    // Handle the value directly if no matching button is found
    handleCalculatorInput(value);
  }
}

// Function to handle calculator input
function handleCalculatorInput(value) {
  if (value >= "0" && value <= "9") {
    currentValue += value;
    if (operator) {
      displayOperation = previousValue + " " + operator + " " + currentValue;
    } else {
      displayOperation = currentValue;
    }
    display.value = displayOperation;
  } else if (value === ".") {
    if (!currentValue.includes(".")) {
      currentValue = currentValue === "" ? "0." : currentValue + ".";
      if (operator) {
        displayOperation = previousValue + " " + operator + " " + currentValue;
      } else {
        displayOperation = currentValue;
      }
      display.value = displayOperation;
    }
  } else if (value === "C") {
    currentValue = "";
    previousValue = "";
    operator = "";
    displayOperation = "";
    display.value = "";
    bracketCount = 0;
  } else if (value === "±") {
    currentValue = (parseFloat(currentValue) * -1).toString();
    if (operator) {
      displayOperation = previousValue + " " + operator + " " + currentValue;
    } else {
      displayOperation = currentValue;
    }
    display.value = displayOperation;
  } else if (value === "%") {
    currentValue = (parseFloat(currentValue) / 100).toString();
    if (operator) {
      displayOperation = previousValue + " " + operator + " " + currentValue;
    } else {
      displayOperation = currentValue;
    }
    display.value = displayOperation;
  } else if (value === "( )" || value.includes("sup") || value === "xy") {
    if (value === "( )") {
      // Add opening or closing bracket based on context
      if (bracketCount === 0 || currentValue.endsWith("(")) {
        currentValue += "(";
        bracketCount++;
      } else {
        currentValue += ")";
        bracketCount--;
      }
      displayOperation = currentValue;
      display.value = displayOperation;
    } else {
      // Handle exponent (^)
      if (currentValue !== "") {
        previousValue = currentValue;
        operator = "^";
        displayOperation = currentValue + " ^ ";
        currentValue = "";
        display.value = displayOperation;
      }
    }
  } else if (["+", "-", "×", "÷"].includes(value)) {
    if (currentValue !== "") {
      if (previousValue !== "") {
        calculate();
        previousValue = currentValue;
        operator = value;
        displayOperation = currentValue + " " + operator + " ";
        currentValue = "";
      } else {
        operator = value;
        previousValue = currentValue;
        displayOperation = currentValue + " " + operator + " ";
        currentValue = "";
      }
      display.value = displayOperation;
    }
  } else if (value === "=") {
    if (currentValue !== "" && previousValue !== "" && operator !== "") {
      displayOperation = previousValue + " " + operator + " " + currentValue;
      calculate();
      operator = "";
      previousValue = "";
      displayOperation = currentValue;
      display.value = displayOperation;
      bracketCount = 0;
    }
  }
}

// Modify button click handlers to use the new handleCalculatorInput function
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    let value = button.textContent;
    // Special handling for exponent button
    if (button.innerHTML.includes('sup')) {
      value = 'xy';
    }
    handleCalculatorInput(value);
  });
});

clearHistoryBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    history = [];
    historyLists.forEach((list) => {
      list.innerHTML = "";
    });
  });
});

function addToHistory(calculation, result) {
  const historyItem = document.createElement("li");
  historyItem.className = "history-item";
  historyItem.textContent = `${calculation} = ${result}`;
  historyItem.addEventListener("click", () => {
    if (operator === "") {
      currentValue = result.toString();
      display.value = currentValue;
      previousValue = "";
    } else {
      currentValue = result.toString();
      display.value = currentValue;
      calculate();
      operator = "";
      previousValue = "";
    }
  });

  // Add to both history lists
  historyLists.forEach((list) => {
    const itemClone = historyItem.cloneNode(true);
    itemClone.addEventListener("click", () => {
      if (operator === "") {
        currentValue = result.toString();
        display.value = currentValue;
        previousValue = "";
      } else {
        currentValue = result.toString();
        display.value = currentValue;
        calculate();
        operator = "";
        previousValue = "";
      }
    });
    list.insertBefore(itemClone, list.firstChild);
  });

  history.push({ calculation, result });
}

function evaluateExpression(expr) {
  // Handle brackets first
  while (expr.includes('(') && expr.includes(')')) {
    const openIndex = expr.lastIndexOf('(');
    const closeIndex = expr.indexOf(')', openIndex);
    if (openIndex === -1 || closeIndex === -1) break;
    
    const subExpr = expr.substring(openIndex + 1, closeIndex);
    const result = evaluateExpression(subExpr);
    expr = expr.substring(0, openIndex) + result + expr.substring(closeIndex + 1);
  }

  // Split the expression into numbers and operators
  const tokens = expr.match(/(-?\d*\.?\d+|[+\-×÷^])/g) || [];
  
  // Handle exponents first (right to left)
  for (let i = tokens.length - 2; i >= 0; i--) {
    if (tokens[i] === '^') {
      const base = parseFloat(tokens[i - 1]);
      const exponent = parseFloat(tokens[i + 1]);
      const result = Math.pow(base, exponent);
      tokens.splice(i - 1, 3, result.toString());
      i = tokens.length - 2;
    }
  }

  // Handle multiplication and division (left to right)
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === '×' || tokens[i] === '÷') {
      const left = parseFloat(tokens[i - 1]);
      const right = parseFloat(tokens[i + 1]);
      const result = tokens[i] === '×' ? left * right : left / right;
      tokens.splice(i - 1, 3, result.toString());
      i--;
    }
  }

  // Handle addition and subtraction (left to right)
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === '+' || tokens[i] === '-') {
      const left = parseFloat(tokens[i - 1]);
      const right = parseFloat(tokens[i + 1]);
      const result = tokens[i] === '+' ? left + right : left - right;
      tokens.splice(i - 1, 3, result.toString());
      i--;
    }
  }

  return tokens[0];
}

function calculate() {
  let result;
  const expression = displayOperation.replace(/\s/g, '');
  
  try {
    if (operator === "^") {
      const base = parseFloat(previousValue);
      const exponent = parseFloat(currentValue);
      if (isNaN(base) || isNaN(exponent)) {
        result = 'Error';
      } else {
        result = Math.pow(base, exponent);
      }
    } else {
      result = evaluateExpression(expression);
    }
  } catch (error) {
    result = 'Error';
  }

  // Add to history before updating the display
  addToHistory(displayOperation, result);
  currentValue = result.toString();
  display.value = currentValue;
}

// Add theme switching functionality
const themeOptions = document.querySelectorAll(".theme-option");
const body = document.body;

themeOptions.forEach((option) => {
  option.addEventListener("click", () => {
    // Remove active class from all options
    themeOptions.forEach((opt) => opt.classList.remove("active"));
    // Add active class to clicked option
    option.classList.add("active");
    // Set the theme
    const theme = option.getAttribute("data-theme");
    body.className = `theme-${theme}`;
  });
}); 