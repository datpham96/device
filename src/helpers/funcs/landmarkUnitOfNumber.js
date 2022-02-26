const DOZEN = 10;
const HUNDRED = 100;
const THOUSAND = 1000;
const DOZEN_THOUSAND = 10000;
const HUNDRED_THOUSAND = 100000;
const MILLION = 1000000;
const DOZEN_MILLION = 10000000;
const HUNDRED_MILLION = 100000000;
const BILLION = 1000000000;
const DOZEN_BILLION = 10000000000;
const HUNDRED_BILLION = 100000000000;

const landmarkUnitOfNumber = num => {
  if (!num) {
    return;
  }
  if (typeof num !== 'number') {
    return 1;
  }
  if (num / HUNDRED_BILLION > 1) {
    return HUNDRED_BILLION;
  } else if (num / DOZEN_BILLION > 1) {
    return DOZEN_BILLION;
  } else if (num / BILLION > 1) {
    return BILLION;
  } else if (num / HUNDRED_MILLION > 1) {
    return HUNDRED_MILLION;
  } else if (num / DOZEN_MILLION > 1) {
    return DOZEN_MILLION;
  } else if (num / MILLION > 1) {
    return MILLION;
  } else if (num / HUNDRED_THOUSAND > 1) {
    return HUNDRED_THOUSAND;
  } else if (num / DOZEN_THOUSAND > 1) {
    return DOZEN_THOUSAND;
  } else if (num / THOUSAND > 1) {
    return THOUSAND;
  } else if (num / HUNDRED > 1) {
    return HUNDRED;
  } else if (num / DOZEN > 1) {
    return DOZEN;
  } else {
    return 1;
  }
};

export default landmarkUnitOfNumber;
