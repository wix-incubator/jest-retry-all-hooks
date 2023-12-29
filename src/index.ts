// eslint-disable-next-line node/no-extraneous-import,node/no-unpublished-import
import type { EnvironmentListenerFn } from 'jest-environment-emit';

import { HookPatcher } from './HookPatcher';

const listener: EnvironmentListenerFn = ({ env, testEvents }) => {
  const patcher = new HookPatcher();

  testEvents.on('setup', ({ event }) => {
    patcher.patchRuntimeGlobals(env.global, event.runtimeGlobals);
  });

  function onFailure() {
    patcher.clearBeforeHooksMemory();
    patcher.setFailedStatus();
  }

  testEvents.on('hook_failure', onFailure);
  testEvents.on('test_fn_failure', onFailure);
  testEvents.on('test_start', () => {
    patcher.clearFailedStatus();
    patcher.clearAfterHooksMemory();
  });
};

export default listener;
