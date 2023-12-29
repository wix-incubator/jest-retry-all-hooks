export class HookPatcher {
  readonly _beforeHooks = new Set<Function>();
  readonly _afterHooks = new Set<Function>();
  _testFailed = false;

  patchRuntimeGlobals(global: any, runtimeGlobals: any) {
    const { beforeEach, afterAll, afterEach } = runtimeGlobals;

    global.beforeAll = runtimeGlobals.beforeAll = (fn: Function, timeout?: number) => {
      const wrapper =
        fn.length === 1
          ? (done: Function) =>
              this._beforeHooks.has(fn) ? done() : (this._beforeHooks.add(fn), fn(done))
          : (...args: unknown[]) =>
              this._beforeHooks.has(fn) ? undefined : (this._beforeHooks.add(fn), fn(...args));

      wrapper.toString = () =>
        this._beforeHooks.has(fn) ? '() => /* patched beforeAll */' : fn.toString();

      beforeEach(wrapper, timeout);
    };

    global.afterAll = runtimeGlobals.afterAll = (fn: Function, timeout?: number) => {
      const wrapperEach =
        fn.length === 1
          ? (done: Function) => (this._testFailed ? (this._afterHooks.add(fn), fn(done)) : done())
          : (...args: unknown[]) =>
              this._testFailed ? (this._afterHooks.add(fn), fn(...args)) : undefined;

      wrapperEach.toString = () =>
        this._testFailed ? fn.toString() : '() => /* patched afterAll */';

      const wrapperAll =
        fn.length === 1
          ? (done: Function) => (this._afterHooks.has(fn) ? done() : fn(done))
          : (...args: unknown[]) => (this._afterHooks.has(fn) ? undefined : fn(...args));

      wrapperAll.toString = () =>
        this._afterHooks.has(fn) ? '() => /* patched afterAll */' : fn.toString();

      afterEach(wrapperEach, timeout);
      afterAll(wrapperAll, timeout);
    };
  }

  clearBeforeHooksMemory() {
    this._beforeHooks.clear();
  }

  clearAfterHooksMemory() {
    this._afterHooks.clear();
  }

  clearFailedStatus() {
    this._testFailed = false;
  }

  setFailedStatus() {
    this._testFailed = true;
  }
}
