const calculator = require('./test-module-1');
const calc1 = new calculator();
console.log(calc1.add(2, 5));

const { add, multiply, divide, subtract } = require('./test-module-2');
console.log(add(2, 5));

require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();
