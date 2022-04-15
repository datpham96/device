import React, {useRef} from 'react';
import {TouchableOpacity} from 'react-native';

const ACTIVE_OPACITY = 0.8;

const Touchable = ({
  children,
  disabled,
  onPress,
  style,
  accessibilityRole,
  accessibilityState,
  accessibilityLabel,
  testID,
  onLongPress,
}) => {
  const touchableTimoutRef = useRef(null);
  const handleOnPress = () => {
    if (touchableTimoutRef.current) {
      clearTimeout(touchableTimoutRef.current);
    }
    touchableTimoutRef.current = setTimeout(async () => {
      //typing code
      onPress();
    }, 0);
  };
  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
      accessibilityRole={accessibilityRole}
      style={style}
      onPress={handleOnPress}
      activeOpacity={ACTIVE_OPACITY}
      disabled={disabled}>
      {children}
    </TouchableOpacity>
  );
};

export default Touchable;
