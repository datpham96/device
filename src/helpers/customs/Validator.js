import Validator from 'validatorjs';
import en from 'validatorjs/src/lang/en';
Validator.setMessages('en', en);

//register rule domain
Validator.register(
  'domain',
  function (value) {
    return value.match(/[a-zA-Z0-9][a-zA-Z0-9]{1,61}(?:\.[a-zA-Z]{2,})+/);
  },
  ':attribute không đúng định dạng',
);

//register rule phone
Validator.register(
  'phone',
  function (value) {
    return value.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/);
  },
  ':attribute không đúng định dạng',
);

//register rule code
Validator.register(
  'code',
  function (value) {
    return value.match(/^[0-9]{6,6}$/);
  },
  ':attribute không đúng định dạng',
);
