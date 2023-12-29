import assert from 'assert';
import listener from 'jest-retry-all-hooks';

assert(typeof listener === 'function', 'jest-retry-all-hooks should have a function as its default export');
