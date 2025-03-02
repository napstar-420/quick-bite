import createConfig from '@quick-bite/eslint-config/create-config';
import path from 'node:path';

const __dirname = new URL('.', import.meta.url).pathname;

export default createConfig({ ignores: [`${path.join(__dirname, 'logs')}/*`] });
