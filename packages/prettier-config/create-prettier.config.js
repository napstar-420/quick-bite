import config from './prettier.config.js';

export default function createPrettierConfig(userConfigs) {
  return {
    ...config,
    ...userConfigs,
  };
}
