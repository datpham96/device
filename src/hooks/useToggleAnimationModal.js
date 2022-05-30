import {useState, useEffect, useRef} from 'react';
import {Animated} from 'react-native';

const useToggleAnimationModal = visible => {
  const [visibleModal, setVisibleModal] = useState(visible);
  const scaleAni = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    toggleModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const toggleModal = () => {
    scaleAni.setValue(0);
    if (visible) {
      setVisibleModal(true);
      Animated.spring(scaleAni, {
        toValue: 1,
        delay: 50,
        useNativeDriver: true,
      }).start();
    } else {
      setVisibleModal(false);
    }
  };

  return [visibleModal, scaleAni];
};

export default useToggleAnimationModal;
