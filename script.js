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
  '.': '.'
};

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
  const button = Array.from(buttons).find(btn => btn.textContent === value);
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
    display.value = currentValue;
  } else if (value === ".") {
    if (!currentValue.includes(".")) {
      currentValue = currentValue === "" ? "0." : currentValue + ".";
      display.value = currentValue;
    }
  } else if (value === "C") {
    currentValue = "";
    previousValue = "";
    operator = "";
    display.value = "";
  } else if (value === "±") {
    currentValue = (parseFloat(currentValue) * -1).toString();
    display.value = currentValue;
  } else if (value === "%") {
    currentValue = (parseFloat(currentValue) / 100).toString();
    display.value = currentValue;
  } else if (["+", "-", "×", "÷"].includes(value)) {
    if (currentValue !== "") {
      if (previousValue !== "") {
        calculate();
      }
      operator = value;
      previousValue = currentValue;
      currentValue = "";
    }
  } else if (value === "=") {
    if (currentValue !== "" && previousValue !== "" && operator !== "") {
      calculate();
      operator = "";
      previousValue = "";
    }
  }
}

// Modify button click handlers to use the new handleCalculatorInput function
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;
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

function calculate() {
  let result;
  const prev = parseFloat(previousValue);
  const current = parseFloat(currentValue);

  switch (operator) {
    case "+":
      result = prev + current;
      break;
    case "-":
      result = prev - current;
      break;
    case "×":
      result = prev * current;
      break;
    case "÷":
      result = prev / current;
      break;
  }

  currentValue = result.toString();
  display.value = currentValue;

  // Add to history
  const calculation = `${prev} ${operator} ${current}`;
  addToHistory(calculation, result);
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