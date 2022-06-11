//using event delegation to listen to all children of calculator_keyboard
const calculator = document.querySelector(".calculator");
const keyboardKeys = calculator.querySelector(".calculator_keyboard");
const screen = document.querySelector(".calculator_display");
const clearBtn = calculator.querySelector("[data-action=clear]");

// functions:
const calculate = function (num1, num2, operation) {
  const val1 = +num1;
  const val2 = +num2;
  let result;
  switch (operation) {
    case "add":
      result = val1 + val2;
      break;
    case "subtract":
      result = val1 - val2;
      break;
    case "multiply":
      result = val1 * val2;
      break;
    case "divide":
      result = val1 / val2;
      break;
  }
  screen.textContent = result;
  return result;
};

const creatScreenString = function (key, displayedValue, calcState) {
  const action = key.dataset.action;
  const keyValue = key.textContent;
  const firstValue = calcState.firstValue;
  const modValue = calcState.modValue;
  const operation = calcState.operation;
  const previousKeyType = calcState.previousKeyType;
  //////////////////////////////////////////////////////
  //when writing numbers
  if (!action) {
    if (
      displayedValue === "0" ||
      previousKeyType === "operator" ||
      previousKeyType === "calculate"
    )
      return keyValue;
    else return displayedValue + keyValue;
  }
  //////////////////////////////////////////////////////
  //when writing decimals
  if (action === "decimal") {
    if (
      displayedValue === "" ||
      previousKeyType === "operator" ||
      previousKeyType === "calculate"
    )
      return "0.";
    if (!displayedValue.includes(".")) return displayedValue + ".";
    return displayedValue;
  }
  /////////////////////////////////////////////////////
  //when using oprators
  if (key.classList.contains("operator")) {
    // for consecutive calculations:
    // for a continous calculations, only happens when the previouskey is the second value, preventing unneeded calculations
    if (
      firstValue &&
      operation &&
      previousKeyType !== "operator" &&
      previousKeyType !== "calculate"
    )
      return calculate(firstValue, displayedValue, operation);
    else return displayedValue;
  }
  ////////////////////////////////////////////////////
  //when clearing screen
  if (action === "clear") return "";
  ////////////////////////////////////////////////////
  //when using '='
  if (action === "calculate") {
    let firstValue = calculator.dataset.firstValue;
    //only calculate when the first value is in
    if (firstValue) {
      //to avoid the bug from pressing '=' repeatedly
      if (previousKeyType === "calculate")
        return calculate(displayedValue, modValue, operation);
      else return calculate(firstValue, displayedValue, operation);
    } else return displayedValue;
  }
};

const getKeyType = function (key) {
  const action = key.dataset.action;
  if (!action) return "number";
  if (key.classList.contains("operator")) return "operator";
  return action;
};

const updateCalcState = function (key, calculator, resValue, displayedValue) {
  const keyType = getKeyType(key);
  const firstValue = calculator.dataset.firstValue;
  const modValue = calculator.dataset.modValue;
  const previousKeyType = calculator.dataset.previousKeyType;
  const operation = calculator.dataset.operation;
  calculator.dataset.previousKeyType = keyType;

  if (keyType === "operator") {
    key.classList.add("pressed");
    calculator.dataset.operation = key.dataset.action;
    if (
      firstValue &&
      operation &&
      previousKeyType !== "operator" &&
      previousKeyType !== "calculate"
    )
      calculator.dataset.firstValue = resValue;
    else calculator.dataset.firstValue = displayedValue;
  }
  ////////////////////////////////////////////////////////
  if (keyType !== "clear") {
    clearBtn.textContent = "CE";
  }

  if (keyType === "clear") {
    // clearing everything
    if (key.textContent === "AC") {
      calculator.dataset.firstValue = "";
      calculator.dataset.modValue = "";
      calculator.dataset.operation = "";
      calculator.dataset.previousKeyType = "";
    } else {
      key.textContent = "AC";
    }
  }
  //////////////////////////////////////////////////
  if (keyType === "calculate") {
    if (firstValue && previousKeyType === "calculate")
      calculator.dataset.modValue = modValue;
    else calculator.dataset.modValue = displayedValue;
  }
  ///////////////////////////////////////////////////
  Array.from(key.parentNode.children).forEach((el) =>
    el.classList.remove("pressed")
  );
};

// event listener
keyboardKeys.addEventListener("click", function (e) {
  if (e.target.matches("button")) {
    const key = e.target;
    const displayedValue = screen.textContent;
    const calcState = calculator.dataset;

    //calling main functions
    const screenString = creatScreenString(key, displayedValue, calcState);

    //calling state & visual functions
    screen.textContent = screenString;
    updateCalcState(key, calculator, screenString, displayedValue);
  }
});
