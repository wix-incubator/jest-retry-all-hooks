# jest-retry-all-hooks

Patch `beforeAll` and `afterAll` hooks to work with `jest.retryTimes`.

## Motivation

```js
jest.retryTimes(1);

beforeAll(() => {
  // This is a part of a root or a nested describe block, and it is not retried normally.
});

test('test', () => {
  // The tests and their `beforeEach` and `afterEach` hooks are retried.
});

afterAll(() => {
  // This is a part of a root or a nested describe block, and it is not retried normally.
});
```

So, what does this library do? It converts `beforeAll` and `afterAll` hooks to
smart `beforeEach` and `afterEach` hooks, which usually run only once, but
if a test fails with an error, here is what happens:

```js
jest.retryTimes(1);

beforeEach(() => {
  // if never ran before, run a function passed to `beforeAll`
  // if previous test failed, run that function again
});

test('test', () => {
  // The behavior `test`, `beforeEach`, `afterEach` stays the same.
});

afterEach(() => {
  // if the test function or preceeding hooks failed, run a function passed to `afterAll`
});

afterAll(() => {
  // if never ran before, run a function passed to `afterAll`
});
```

See the [__tests__/hooks.ts](./src/__tests__/hooks.ts) for an elaborate example
of how it works:

```plain
B b -1 a A
B b -2 a A
B b  3 a
  b  1 a
  b -2 a A
B b  2 a A
```

The example above demonstrates how `jest.retryTimes(2)` will work with the
patched `beforeAll` (B), `beforeEach` (b), `afterEach` (a), and `afterAll` (A) hooks and
flaky tests (1, 2, 3), where negative numbers indicate failures, and positive
numbers indicate successes.

Please note that the patched `beforeAll` and `afterAll` hooks won't be associated with
describe blocks, so they will be executed whenever a test fails, even if the `afterAll`
hook seems to be outside the describe block.

## Installation

Install the package:

```sh
npm install --save-dev jest-retry-all-hooks
```

Add to your `jest.config.js`:

```diff
- testEnvironment: 'node',
+ testEnvironment: 'jest-environment-emit/node',
+ testEnvironmentOptions: {
+   eventListeners: [
+     'jest-retry-all-hooks',
+   ],
+ },
```

If you don't have `jest-enviroment-emit` installed, you can install it:

```sh
npm install --save-dev jest-environment-emit
```

You can also use any other test environment compatible with `jest-environment-emit`, e.g.:

- [jest-environment-emit/jsdom](https://github.com/wix-incubator/jest-environment-emit)
- [jest-metadata/environment-node](https://github.com/wix-incubator/jest-metadata)
- [jest-metadata/environment-jsdom](https://github.com/wix-incubator/jest-metadata)
- [jest-allure2-reporter/environment-node](https://github.com/wix-incubator/jest-allure2-reporter)
- [jest-allure2-reporter/environment-jsdom](https://github.com/wix-incubator/jest-allure2-reporter)
- [detox/runners/jest/testEnvironment](https://github.com/wix/Detox)

Use [GitHub Topic Search](https://github.com/topics/jest-environment-emit) to find more compatible test environments.

## License

Licensed under the [MIT License](./LICENSE).
