const PASS_MIN_LENGTH = 8;
const PASS_MAX_LENGTH = 64;
const PASS_ALLOWED_SPECIAL_CHARS = '@$!%*?&_';

export default {
  API_PORT: 8080,
  APP_NAME: 'Quick Bite',
  PASS_MIN_LENGTH,
  PASS_MAX_LENGTH,
  PASS_ALLOWED_SPECIAL_CHARS,
  PASS_REGEX: new RegExp(
    // eslint-disable-next-line style/max-len, regexp/prefer-w
    `^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[${PASS_ALLOWED_SPECIAL_CHARS}])[A-Za-z\\d${PASS_ALLOWED_SPECIAL_CHARS}]{${PASS_MIN_LENGTH},${PASS_MAX_LENGTH}}$`,
  ),
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 64,
};
