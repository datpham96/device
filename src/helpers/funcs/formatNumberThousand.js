const ONE = 1;
const ZERO = 0;
const BILLION = 1000000000;
const MILLION = 1000000;
const THOUSAND = 1000;
const B_UNIT = 'B';
const M_UNIT = 'M';
const K_UNIT = 'K';

const formatNumberThousand = (num = ZERO) => {
  let total = num;
  if (num / BILLION > ONE) {
    total = (num / BILLION).toFixed(ONE) + B_UNIT;
  } else if (num / MILLION > ONE) {
    total = (num / MILLION).toFixed(ONE) + M_UNIT;
  } else if (num / THOUSAND > ONE) {
    total = (num / THOUSAND).toFixed(ONE) + K_UNIT;
  }

  return total;
};

export default formatNumberThousand;
