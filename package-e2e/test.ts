import listener from 'jest-retry-all-hooks';
import { EnvironmentListenerFn } from 'jest-environment-emit';

function assertType<T>(_actual: T): void {
  // no-op
}

assertType<EnvironmentListenerFn>(listener);
