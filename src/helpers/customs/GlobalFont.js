import React from 'react';
import {Text, TextInput} from 'react-native';
import lodash from 'lodash';

let _applyed = false;
export default class GlobalFont {
  static applyGlobal(fontFamily, size, color) {
    if (_applyed) {
      return;
    }
    const oldTextRender = Text.render;
    Text.render = function (...args) {
      const origin = oldTextRender.call(this, ...args);
      return React.cloneElement(origin, {
        style: [
          {fontFamily: fontFamily, fontSize: size, color: color},
          origin.props.style,
        ],
      });
    };
    // Text.render = lodash.wrap(Text.render, function (func, ...args) {
    //   let originText = func.apply(this, args);
    //   return React.cloneElement(originText, {
    //     style: [
    //       {
    //         fontFamily: fontFamily,
    //         fontSize: size,
    //         color: color,
    //       },
    //       originText.props.style,
    //     ],
    //   });
    // });
    TextInput.render = lodash.wrap(TextInput.render, function (func, ...args) {
      let originTextInput = func.apply(this, args);
      return React.cloneElement(originTextInput, {
        style: [
          {
            fontFamily: fontFamily,
            fontSize: size,
            color: color,
          },
          originTextInput.props.style,
        ],
      });
    });
    _applyed = true;
  }
}
