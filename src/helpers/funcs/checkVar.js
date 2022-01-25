const check = {
  isEmpty: val => {
    if (!val || val === 'undefined') {
      return true;
    }
    var typeOfVal = typeof val;
    var retVal = false;
    switch (typeOfVal) {
      case 'array':
        retVal = val.length < 1 ? true : false;
        break;
      case 'object':
        var arrKey = Object.keys(val);
        retVal = arrKey.length < 1 ? true : false;
        break;
      case 'string':
        retVal = val.length < 1 ? true : false;
        break;
    }
    return retVal;
  },
  isPhone: val => {
    let pattern = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    var retVal = false;
    if (pattern.test(val)) {
      retVal = true;
    }
    return retVal;
  },
  isPassword: val => {
    let pattern =
      // eslint-disable-next-line no-useless-escape
      /^(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!?><,`'"!~;:\|\\^@#\$%\^\&*\)\(+=._-}{\[\]]{8,16}$/;
    // (?=.*\d)          // should contain at least one digit
    // (?=.*[a-z])       // should contain at least one lower case
    // (?=.*[A-Z])       // should contain at least one upper case
    // [a-zA-Z0-9]{8,16}   // should contain at least 8 from 16 the mentioned characters
    var retVal = false;
    if (pattern.test(val)) {
      retVal = true;
    }
    return retVal;
  },
  isVerifyCode: val => {
    let pattern = /^[0-9]{6,6}$/;
    // (?=.*\d)          // should contain at least one digit
    // (?=.*[a-z])       // should contain at least one lower case
    // (?=.*[A-Z])       // should contain at least one upper case
    // [a-zA-Z0-9]{8,16}   // should contain at least 8 from 16 the mentioned characters
    var retVal = false;
    if (pattern.test(val)) {
      retVal = true;
    }
    return retVal;
  },
  isEmail: val => {
    let pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var retVal = false;
    if (pattern.test(val)) {
      retVal = true;
    }
    return retVal;
  },
  isNumber: val => {
    let patternNum = /^\d+$/;
    var retVal = false;
    if (patternNum.test(val)) {
      retVal = true;
    }
    return retVal;
  },
  isHTML: val => {
    return /<[a-z/][\s\S]*>/i.test(val);
  },
};

export default check;
