var booleanFunction = document.getElementById("boolean-function");
var booleanTable = document.getElementById("boolean-table");
var sumBooleanTable = document.getElementById("sum-boolean-table");
var productBooleanTable = document.getElementById("product-boolean-table");
var complementBooleanTable = document.getElementById("complement-boolean-table");
var generator = document.getElementById("generator");
var generatedTableCaption = document.getElementById("results");
var headers = [];
var varValues = [];
var updatedFunction = [];
var results = [];
var varValuesString;
var binaryBooleanFunction;
var cols;
var rows;

function distinctLetters() {
     var distinctLetters = [];
     // booleanFunctionArr = booleanFunction.value.split("");
     for (let i = 0; i < booleanFunction.value.length; i++) {
          let el = booleanFunction.value.charAt(i);
          if (distinctLetters.indexOf(el) == -1 && /[A-Za-z]/.test(booleanFunction.value[i])) {
               distinctLetters.push(el);
          }
     }
     return distinctLetters;
}

function convertToBinary(x) {
     var binary = x.toString(2);
     if (binary.length < cols) {
          return binary.padStart(cols, "0");
     } else {
          return binary;
     }
}

function initializeHeader() {
     headers = [];
     
     // A header for each distinct letter and 
     for (let i = 0; i <= distinctLetters().length + 1; i++) {
          var booleanVar = document.createElement("TH");
          if (i < distinctLetters().length) {
               booleanVar.innerHTML = distinctLetters()[i];
               headers.push(distinctLetters()[i]);
               booleanTable.appendChild(booleanVar);
          } else if (i == distinctLetters().length) {
               finishHeader();
          } else {
               booleanVar.innerHTML = booleanFunction.value;
               booleanTable.appendChild(booleanVar);
          }
     }
}

function finishHeader() {
     headers = headers.concat(booleanFunction.value.split("+"));
     const uniqueFunctions = new Set(headers);
     var intermediateFunctions = Array.from(uniqueFunctions);
     for (let i = distinctLetters().length; i < intermediateFunctions.length; i++) {
          if (intermediateFunctions[i] != booleanFunction.value) {
               var intermediateFunctionHeader = document.createElement("TH");
               intermediateFunctionHeader.innerHTML = intermediateFunctions[i];
               booleanTable.append(intermediateFunctionHeader);
          }
     }
}

function initializeTable() {
     for (let i = 0; i < rows; i++) {
          var row = booleanTable.insertRow(i);

          for (let j = 0; j < cols; j++) {
               var newCell = row.insertCell(-1);

               if (j % cols == 0) {
                    newCell.innerHTML = varValuesString[i * cols];
               } else {
                    newCell.innerHTML = varValuesString[(i * cols) + j];
               }
          }
     }
}

function finishTable() {
     varValues = [];

     while (booleanTable.hasChildNodes()) {
          booleanTable.removeChild(booleanTable.firstChild);
     }
     
     if (checkValidity()) {
          cols = distinctLetters().length;
          rows = Math.pow(2, cols);

          for (let i = rows - 1; i >= 0; i--) {
               varValues.push((convertToBinary(i)));
          }
          varValuesString = varValues.join("");

          replace();
          generatedTableCaption.innerHTML = "Results";
          booleanTable.appendChild(generatedTableCaption);
          initializeHeader();
          initializeTable();
          insertResults();
     }
}

function replace() {
     for (let i = 0; i < rows; i++) {
          binaryBooleanFunction = "";

          for (let j = 0; j < booleanFunction.value.length; j++) {
               if (booleanFunction.value[j] == "\u0305") {
                    binaryBooleanFunction += "\u0305";
               } else if (booleanFunction.value[j] == "+") {
                    binaryBooleanFunction += booleanFunction.value[j];
               } else {
                    //	First finds index of the current Boolean variable inside array of distinctLetters, then
                    //	adds (i * col) to get the appropriate index for the appropriate value in varValuesString, then
                    //	pushes the value to binaryBooleanFunction
                    var varValue = varValuesString[[distinctLetters().indexOf(booleanFunction.value[j]) + (i * cols)]];
                    binaryBooleanFunction += varValue;
               }
          }
          
          console.log(binaryBooleanFunction);
          calculate(binaryBooleanFunction);
     }
     
     return results;
}

function calculate(string) {
     var splitBySumOperator = string.split("+");

     for (let i = 0; i < splitBySumOperator.length; i++) {
          if (!splitBySumOperator[i].includes("\u0305")) {
               product(splitBySumOperator[i], splitBySumOperator.length, i);
          } else {
               var complementedVariableIndex = splitBySumOperator[i].indexOf("\u0305") - 1;
               var newFunction = spliceSplit(splitBySumOperator[i], complementedVariableIndex, 2, complement(splitBySumOperator[i][complementedVariableIndex]));

               if (newFunction.length == 1 && !elementJIsDuplicate(i)) {
                    results.push(parseInt(newFunction));
               }
               
               splitBySumOperator[i] = newFunction;
               i--;
          }
     }
}

function complement(x) {
     var complement = (x == 0) ? 1 : 0;
     return complement;
}

function product(string, length, i) {
     if (i == 0) {
          updatedFunction = [];
     }

     var product = (string.includes("0")) ? 0 : 1;

     if (string.length == 1) {
          updatedFunction.push(parseInt(string));
     } else {
          updatedFunction.push(product);
          if (!elementJIsDuplicate(i)) {
               results.push(product);
          }
     }

     if (updatedFunction.length == length) {
          return regroup(updatedFunction);
     }
}

function sum(string) {
     var sum = (string.includes("1")) ? 1 : 0;
     results.push(sum);
     return sum;
}

function regroup(array) {
     finalSum = array.join("+");

     if (finalSum.includes("+")) {
          return sum(finalSum);
     }
     return;
}

function elementJIsDuplicate(j) {
     var splitBySumOperator = booleanFunction.value.split("+");
     
     //  If the index of the first time the product occurs is lower than the index of the product the calculator is on,
     //  then the product that the calculator is on is a second or higher occurrence
     if (j > splitBySumOperator.indexOf(splitBySumOperator[j])) {
          return true;
     }
     return false;
}

function insertResults() {
     console.log(results);
     var count = 0;
     for (let i = 0; i < rows; i++) {
          for (let j = distinctLetters().length; j < booleanTable.getElementsByTagName("TH").length; j++) {
               var newCell = booleanTable.rows[i].insertCell(-1);
               newCell.innerHTML = results[count];
               count++;
          }
     }
     results = [];
}

function insert(index, string) {
     booleanFunctionArr = booleanFunction.value.split("");
     booleanFunctionArr.splice(index, 0, string);
     return booleanFunctionArr.join("");
}

function spliceSplit(string, index, count, add) {
     var arr = string.split("");
     arr.splice(index, count, add);
     return arr.join("");
}

function replaceAt(index, replacement) {
     booleanFunctionArr = booleanFunction.value.split("");
     booleanFunctionArr.splice(index, 1, replacement);
     return booleanFunctionArr.join("");
}

function setOverlineToPos(index, string) {
     booleanVariable = string[index];
     booleanVariable += "\u0305";
     return replaceAt(index, booleanVariable);
}

function operatorToInput(target) {
     var pos = booleanFunction.selectionStart;

     if (target.id == "complement") {
          if (booleanFunction.selectionStart == booleanFunction.selectionEnd && booleanFunction.value[pos - 1] != undefined && /[A-Za-z]/.test(booleanFunction.value[pos - 1])) {
               booleanFunction.value = setOverlineToPos(pos - 1, booleanFunction.value);
          } else if (booleanFunction.value[pos - 1] == "\u0305") {
               alert("Please note that a double complement would be the same as not having any complements, like the double negation law in symbolic logic.")
          } else {
               alert("Please note that for whichever Boolean variable you would like to overline, type the variable, then click the overline button.")
          }
     }

     if (target.id == "product") {
          alert("The product dot may be omitted; simply type the Boolean variables adjacent to each other.");
     }

     if (target.id == "sum") {
          booleanFunction.value = insert(pos, target.innerHTML);
     }
}

class Stack { 
     // Array is used to implement stack 
     constructor() {
          this.items = [];
     }

     // Push element into the items
     push(element) {
          this.items.push(element);
     }

     // Return top most element in the stack
     // and removes it from the stack
     // Underflow if stack is empty
     pop() {
          if (this.items.length == 0)
               return "Underflow";
          return this.items.pop();
     }

     // Return true if stack is empty
     isEmpty() {          
          return this.items.length == 0;
     }

     printStack() {
          var str = "";
          for (var i = 0; i < this.items.length; i++)
               str += this.items[i] + " ";
          return str;
     }
}

function checkValidity() {
     var functionStack = new Stack();
     
     if (booleanFunction.value.length == 0 || booleanFunction.value.length == 1) {
          alert("Please input a valid Boolean function.");
          return false;
     }

     if (!/^[\u0305A-Za-z()+]*$/.test(booleanFunction.value)) {
          alert("Please use letters and the Boolean operators only.");
          return false;
     }

     for (let i = 0; i < booleanFunction.value.length; i++) {
          if (booleanFunction.value[i] == "(") {
               functionStack.push(booleanFunction.value[i]);
          }

          if (booleanFunction.value[i] == ")") {
               functionStack.pop();
          }

          // Sum operator must have a Boolean variable or overline before it and it must have a Boolean variable after it,
          // so if either of those are false, then the sum operator was used incorrectly
          if (booleanFunction.value[i] == "+") {
               if (((booleanFunction.value[i - 1] == "\u0305" || booleanFunction.value[i - 1] != undefined) && booleanFunction.value[i + 1] != undefined) == false) {
                    alert("Please check your syntax, the sum operator must be in between Boolean variables.");
                    return false;
               }
          }

          
          
          // if (booleanFunction.value[i] == "\u0305" && !/[A-Za-z]/.test(booleanFunction.value[i - 1])) {
          //      alert("Please check your syntax, for whichever Boolean variable you would like to overline, type the character, then click the overline button");
          //      return false;
          // }
     }

     if (functionStack.printStack().includes("(")) {
          alert("Please balance your parentheses.");
          return false;
     }

     return true;
}

booleanFunction.addEventListener("keypress", generateOnKeypress);

function generateOnKeypress(event) {
     if (event.which === 13) {
          finishTable();
     }
}