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
  '^': 'xy',
  'r': '√',
  'p': 'PI'
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
  } else if (value === "PI") {
    console.log("PI button clicked! Adding pi value: 3.14...");
    currentValue = "3.14...";
    if (operator) {
      displayOperation = previousValue + " " + operator + " " + currentValue;
    } else {
      displayOperation = currentValue;
    }
    display.value = displayOperation;
  } else if (value === "(" || value === ")" || value.includes("sup") || value === "xy" || value === "√") {
    if (value === "(") {
      // Add opening bracket
      currentValue += "(";
      bracketCount++;
      displayOperation = currentValue;
      display.value = displayOperation;
    } else if (value === ")") {
      // Add closing bracket if there are open brackets
      if (bracketCount > 0) {
        currentValue += ")";
        bracketCount--;
        displayOperation = currentValue;
        display.value = displayOperation;
      }
    } else if (value === "√") {
      // Handle square root
      console.log("Root function triggered! Current value:", currentValue);
      if (currentValue !== "") {
        const num = parseFloat(currentValue);
        console.log("Parsed number:", num);
        if (num >= 0) {
          const result = Math.sqrt(num);
          console.log("Square root result:", result);
          currentValue = result.toString();
          displayOperation = currentValue;
          display.value = displayOperation;
        } else {
          console.log("Negative number, showing error");
          currentValue = "Error";
          display.value = "Error";
        }
      } else {
        console.log("No current value to take square root of");
      }
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
    // Skip the cheat sheet button - it has its own handler
    if (button.id === 'cheat-sheet-btn') {
      return;
    }
    
    let value = button.textContent;
    console.log("Button clicked:", value, "Button ID:", button.id);
    
    // Test for root button specifically
    if (button.id === 'root-button') {
      console.log("ROOT BUTTON CLICKED!");
    }
    
    // Special handling for exponent button
    if (button.innerHTML.includes('sup')) {
      value = 'xy';
    }
    
    // Special handling for PI button
    if (button.id === 'pi-button') {
      console.log("PI button detected by ID!");
      value = 'PI';
    }
    
    // Special handling for bracket buttons
    if (button.id === 'open-bracket') {
      console.log("Open bracket button detected!");
      value = '(';
    }
    
    if (button.id === 'close-bracket') {
      console.log("Close bracket button detected!");
      value = ')';
    }
    
    
    
    // Special handling for root button
    if (button.id === 'root-button') {
      console.log("Root button detected by ID!");
      value = '√';
      console.log("Setting value to √ for root button");
    }
    
    console.log("Calling handleCalculatorInput with value:", value);
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

// Add cheat sheet functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, looking for cheat sheet link...');
  const cheatSheetLink = document.getElementById('cheat-sheet-btn');
  console.log('Found link:', cheatSheetLink);
  if (cheatSheetLink) {
    console.log('Link found, adding click listener...');
    
    // Force the button to be large
    console.log('Forcing button to be large...');
    cheatSheetLink.style.fontSize = '96px';
    cheatSheetLink.style.padding = '50px 100px';
    cheatSheetLink.style.minHeight = '250px';
    cheatSheetLink.style.minWidth = '700px';
    cheatSheetLink.style.border = '8px solid #ff6b9d';
    cheatSheetLink.style.borderRadius = '30px';
    cheatSheetLink.style.backgroundColor = '#ff6b9d';
    cheatSheetLink.style.color = 'white';
    cheatSheetLink.style.display = 'inline-block';
    cheatSheetLink.style.width = 'auto';
    cheatSheetLink.style.marginBottom = '20px';
    cheatSheetLink.style.cursor = 'pointer';
    cheatSheetLink.style.position = 'relative';
    cheatSheetLink.style.zIndex = '9999';
    cheatSheetLink.style.textDecoration = 'none';
    cheatSheetLink.style.lineHeight = '1.2';
    cheatSheetLink.style.fontWeight = 'bold';
    cheatSheetLink.style.fontFamily = '"Dancing Script", cursive';
    cheatSheetLink.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5)';
    
    // Also force the icon to be large
    const icon = cheatSheetLink.querySelector('i');
    if (icon) {
      icon.style.fontSize = '100px';
      icon.style.verticalAlign = 'middle';
    }
    
    console.log('Button styles applied:', {
      fontSize: cheatSheetLink.style.fontSize,
      padding: cheatSheetLink.style.padding,
      minHeight: cheatSheetLink.style.minHeight,
      minWidth: cheatSheetLink.style.minWidth
    });
    
    cheatSheetLink.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Cheat Sheet button clicked!');
      
      // Create a new window with cheat sheet content
      const newWindow = window.open('', '_blank', 'width=1000,height=800,scrollbars=yes,resizable=yes');
      
      // Write HTML content to the new window
      newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cheat Sheet - Sara Calculator</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: "Dancing Script", cursive;
              background: linear-gradient(135deg, #ff6b9d 0%, #ff4d8a 100%);
              color: white;
              min-height: 100vh;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .content {
              background: rgba(255, 255, 255, 0.1);
              padding: 30px;
              border-radius: 15px;
              backdrop-filter: blur(10px);
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }
            .back-btn {
              background: rgba(255, 255, 255, 0.2);
              border: none;
              color: white;
              padding: 12px 24px;
              border-radius: 25px;
              cursor: pointer;
              font-size: 16px;
              transition: all 0.3s ease;
              margin-top: 20px;
            }
            .back-btn:hover {
              background: rgba(255, 255, 255, 0.3);
              transform: translateY(-2px);
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📚 Calculator Cheat Sheet 📚</h1>
            <p>Quick reference for all calculator functions!</p>
          </div>
          <div class="content">
            <h2>Basic Operations</h2>
            <p>➕ Addition: Use the + button</p>
            <p>➖ Subtraction: Use the - button</p>
            <p>✖️ Multiplication: Use the × button</p>
            <p>➗ Division: Use the ÷ button</p>
            <p>💯 Percentage: Use the % button</p>
            <p>🔄 Clear: Use the C button</p>
            <p>📊 PI: Use the PI button for π value</p>
            <p>🔢 Square Root: Use the √ button</p>
            <p>📈 Exponent: Use the xʸ button</p>
            <p>🔀 Parentheses: Use ( and ) buttons</p>
            <button class="back-btn" onclick="window.close()">Close Cheat Sheet</button>
          </div>
        </body>
        </html>
      `);
      
      newWindow.document.close();
    });
  }
});