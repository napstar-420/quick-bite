import config from "./index.js";

export default function createConfig<T extends object>(options?: T) {
  return {
    ...config,
    ...options,
  };
}
