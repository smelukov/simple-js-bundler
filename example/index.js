import moduleA from './a';
import { a, b, c } from './c';

const some = './b';
const some1 = require(some);
const some2 = require(some);

console.log(moduleA, a, b, c, some1, some2);
