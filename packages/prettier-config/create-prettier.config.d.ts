import { Config } from 'prettier';
import config from './prettier.config.js';

declare function createPrettierConfig(userConfigs: Partial<Config>): Config;

export default createPrettierConfig;
