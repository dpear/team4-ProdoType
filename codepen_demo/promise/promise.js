const idx = 0;
const symbol = ["(", "[", "{"];
const pairs = new Map();
pairs.set('(', ')');
pairs.set('[', ']');
pairs.set('{', '}');

function handleError() {
  document.getElementById("paranthesis").innerHTML += "bound_exceeded";
}

let printParanthesis = function (index) {
    return new Promise((resolve,reject) => {
    	if (index < symbol.length) {
      	document.getElementById("paranthesis").innerHTML += symbol[index] + pairs.get(symbol[index]) + " ";
        resolve(index + 1);
      } else {
      	reject();
      }
      });
   }

printParanthesis(idx)
	.then(printParanthesis, handleError) 
  .then(printParanthesis, handleError) 
  .then(printParanthesis, handleError) 
  .then(printParanthesis, handleError) // Bound exceed
 