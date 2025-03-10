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

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    if (value >= "0" && value <= "9") {
      currentValue += value;
      display.value = currentValue;
    } else if (value === ".") {
      // Only add decimal if it doesn't exist in current value
      if (!currentValue.includes(".")) {
        // If no number entered yet, start with "0."
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
        return;
      }
    }
  });
});

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