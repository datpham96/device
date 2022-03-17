import React, {useState, useEffect} from 'react';
import {Loading, TextError, CountDown} from 'components';
import {Text, Button, Background, ButtonBack, Input} from 'base';
import {View} from 'react-native';
import images from 'images';
import styles from './styles';
import {commonStyles, fonts, sizes} from 'styles';
import * as RootNavigation from 'RootNavigation';
import navigationTypes from 'navigationTypes';
import {useDispatch, useSelector} from 'react-redux';
import {Toast} from 'customs';
import {resetPasswordRequest, resetPasswordReset} from 'actions/loginActions';
import Validator from 'validatorjs';
import {checkVar} from 'src/helpers/funcs';

const OtpNewPassword = () => {
  const dispatch = useDispatch();
  const isLoadingResetPassword = useSelector(
    state => state.auth.isLoadingResetPassword,
  );
  const statusResetPassword = useSelector(
    state => state.auth.statusResetPassword,
  );
  const expiredTime = useSelector(state => state.auth.expiredTime);
  const phone = useSelector(state => state.auth.phone);
  const dataErrors = useSelector(state => state.auth.errors);
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [errors, setErrors] = useState({});
  const [countdownTime, setCountdownTime] = useState(expiredTime);

  useEffect(() => {
    if (dataErrors && dataErrors?.msg) {
      Toast(dataErrors?.msg);
      dispatch(resetPasswordReset());
    }
  }, [dataErrors, dispatch]);

  useEffect(() => {
    if (statusResetPassword) {
      // Toast('Lấy lại mật khẩu thành công');
      dispatch(resetPasswordReset());
      RootNavigation.navigate(navigationTypes.statusSuccess.screen, {
        labelBtn: 'Quay lại đăng nhập',
        screenName: navigationTypes.login.screen,
      });
    }
  }, [statusResetPassword, dispatch]);

  const handleSend = () => {
    let validation = new Validator(
      {
        password: password,
        rePassword: rePassword,
        otp: otp,
      },
      {
        password: 'required',
        rePassword: 'required',
        otp: 'required|code',
      },
      {
        'required.password': 'Mật khẩu mới không được bỏ trống',
        'required.rePassword': 'Nhập lại mật khẩu mới không được bỏ trống',
        'required.otp': 'Mã OTP không được bỏ trống',
        'code.otp': 'Mã OTP không đúng định dạng',
      },
    );

    if (validation.fails()) {
      setErrors({
        ...errors,
        password: validation.errors.first('password'),
        rePassword: validation.errors.first('rePassword'),
        otp: validation.errors.first('otp'),
      });
      if (
        !validation.errors.first('password') &&
        !checkVar.isPassword(password)
      ) {
        setErrors({
          ...errors,
          password:
            'Mật khẩu phải lớn hơn 8 ký tự, ít nhất 1 ký tự viết hoa, 1 ký tự đặc biệt và 1 số',
          rePassword: validation.errors.first('rePassword'),
          otp: validation.errors.first('otp'),
        });
        return;
      }
      return;
    }

    if (validation.passes()) {
      setErrors({
        ...errors,
        password: validation.errors.first('password'),
        rePassword: validation.errors.first('rePassword'),
        otp: validation.errors.first('otp'),
      });
      if (!checkVar.isPassword(password)) {
        setErrors({
          ...errors,
          password:
            'Mật khẩu phải lớn hơn 8 ký tự, ít nhất 1 ký tự viết hoa, 1 ký tự đặc biệt và 1 số',
          otp: false,
          rePassword: false,
        });
        return;
      } else {
        setErrors({
          ...errors,
          password: false,
        });
      }
    }

    if (password !== rePassword) {
      setErrors({
        ...errors,
        rePassword: 'Nhập lại mật khẩu mới không khớp',
        password: false,
        otp: false,
      });
      return;
    } else {
      setErrors({
        ...errors,
        rePassword: false,
        password: false,
        otp: false,
      });
    }

    dispatch(resetPasswordRequest(otp, phone, password, rePassword));
  };

  const handleCountdownFinished = () => {
    setCountdownTime(0);
  };

  return (
    <Background isKeyboard bout>
      <ButtonBack
        onPress={() => RootNavigation.navigate(navigationTypes.login.screen)}
      />
      <Loading isLoading={isLoadingResetPassword} />
      <View style={styles.contentContainer}>
        <Text style={[commonStyles.mainTitle, styles.mainTitle]}>
          Nhập mật khẩu mới
        </Text>
        <View style={styles.inputPhoneContainer}>
          <Input
            value={otp}
            onChangeValue={val => setOtp(val.replace(/[^0-9]/g, ''))}
            placeholder="Nhập mã OTP"
            icon={images.icons.otp_outline}
            props={{
              textContentType: 'oneTimeCode',
              maxLength: sizes.SIZE_6,
            }}
          />
          {errors?.otp && <TextError message={errors?.otp} />}
        </View>
        <View style={styles.inputPasswordContainer}>
          <Input
            value={password}
            onChangeValue={val => setPassword(val)}
            props={{
              secureTextEntry: true,
            }}
            placeholder="Nhập mật khẩu mới"
            icon={images.icons.key}
          />
          {errors?.password && <TextError message={errors?.password} />}
        </View>
        <View style={styles.inputPasswordContainer}>
          <Input
            value={rePassword}
            onChangeValue={val => setRePassword(val)}
            props={{
              secureTextEntry: true,
            }}
            placeholder="Nhập lại mật khẩu mới"
            icon={images.icons.key}
          />
          {errors?.rePassword && <TextError message={errors?.rePassword} />}
        </View>
        <Button onPress={handleSend} customStyle={styles.btn} label="Lưu lại" />
        {!checkVar.isEmpty(countdownTime) ? (
          <View style={styles.wrapTextOtp}>
            <Text>
              Thời gian{' '}
              <Text style={{fontFamily: fonts.lexendDeca.FONT_BOLD}}>OTP</Text>{' '}
              còn hiệu lực:{' '}
              {/* <Text style={{fontFamily: fonts.lexendDeca.FONT_BOLD}}>10:00</Text> */}
            </Text>
            <CountDown
              digitTxtStyle={styles.digitTxtStyle}
              digitStyle={styles.digitStyle}
              showSeparator={true}
              timeToShow={['M', 'S']}
              timeLabels={false}
              until={countdownTime}
              onFinish={handleCountdownFinished}
            />
          </View>
        ) : (
          <View style={styles.wrapTextOtp}>
            <Text>OTP đã hết thời gian hiệu lực</Text>
          </View>
        )}
      </View>
    </Background>
  );
};

export default OtpNewPassword;
