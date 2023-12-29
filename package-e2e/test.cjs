const assert = require('assert');
const listener = require('jest-retry-all-hooks');

assert(typeof listener === 'function', 'jest-retry-all-hooks should have a function as its default export');
assert(listener.default === listener, 'jest-retry-all-hooks should have a fallback for default export');
