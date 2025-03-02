import config from './index.js';

type Config = typeof config;

export default function createConfig<T extends object>(
  options?: T
): Config & T {
  return {
    ...config,
    ...options,
  } as Config & T;
}
