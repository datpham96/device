import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
//node_modules
import {useDispatch, useSelector} from 'react-redux';
import Validator from 'validatorjs';
//api
//base
import {Text, Button, Background, ButtonBack, Input} from 'base';
//components
import {Loading, TextError} from 'components';
//config
import images from 'images';
import {commonStyles} from 'styles';
//helpers
import {checkVar, flashMessage} from 'helpers/funcs';
//HOC
//hooks
//navigation
import * as RootNavigation from 'RootNavigation';
//storages
//redux-stores
import {changePasswordRequest, changePasswordReset} from 'actions/userActions';
//feature
import styles from './styles';
//code-splitting
//screen

const NewPassword = () => {
  const dispatch = useDispatch();

  const isLoadingChangePassword = useSelector(
    state => state.user.isLoadingChangePassword,
  );
  const statusChangePassword = useSelector(
    state => state.user.statusChangePassword,
  );

  const dataErrors = useSelector(state => state.user.errors);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [secureTextEntryOldPassword, setSecureTextEntryOldPassword] =
    useState(true);
  const [secureTextEntryNewPassword, setSecureTextEntryNewPassword] =
    useState(true);
  const [secureTextEntryReNewPassword, setSecureTextEntryReNewPassword] =
    useState(true);

  useEffect(() => {
    if (dataErrors && dataErrors?.msg) {
      flashMessage.error(dataErrors?.msg);
      dispatch(changePasswordReset());
    }
  }, [dataErrors, dispatch]);

  useEffect(() => {
    if (statusChangePassword) {
      flashMessage.success('Cập nhật mật khẩu thành công');
      dispatch(changePasswordReset());
      RootNavigation.goBack();
    }
  }, [statusChangePassword, dispatch]);

  const handleSave = () => {
    const validation = new Validator(
      {
        oldPassword: oldPassword,
        newPassword: newPassword,
        reNewPassword: reNewPassword,
      },
      {
        oldPassword: 'required',
        newPassword: 'required',
        reNewPassword: 'required',
      },
      {
        'required.oldPassword': 'Mật khẩu hiện tại không được bỏ trống',
        'required.newPassword': 'Mật khẩu mới không được bỏ trống',
        'required.reNewPassword': 'Nhập lại mật khẩu mới không được bỏ trống',
      },
    );

    if (validation.fails()) {
      setErrors({
        ...errors,
        oldPassword: validation.errors.first('oldPassword'),
        newPassword: validation.errors.first('newPassword'),
        reNewPassword: validation.errors.first('reNewPassword'),
      });
      if (
        !validation.errors.first('newPassword') &&
        !checkVar.isPassword(newPassword)
      ) {
        setErrors({
          ...errors,
          newPassword:
            'Mật khẩu phải lớn hơn 8 ký tự, ít nhất 1 ký tự viết hoa, ký tự thường, 1 ký tự đặc biệt và 1 số',
        });
        return;
      }
      return;
    }

    if (validation.passes()) {
      setErrors({
        ...errors,
        oldPassword: validation.errors.first('oldPassword'),
        newPassword: validation.errors.first('newPassword'),
        reNewPassword: validation.errors.first('reNewPassword'),
      });

      if (!checkVar.isPassword(newPassword)) {
        setErrors({
          ...errors,
          newPassword:
            'Mật khẩu phải lớn hơn 8 ký tự, ít nhất 1 ký tự viết hoa, ký tự thường, 1 ký tự đặc biệt và 1 số',
          oldPassword: false,
          reNewPassword: false,
        });
        return;
      } else {
        setErrors({
          ...errors,
          newPassword: false,
        });
      }
    }

    if (newPassword !== reNewPassword) {
      setErrors({
        ...errors,
        reNewPassword: 'Mật khẩu xác nhận không khớp',
        newPassword: false,
        oldPassword: false,
      });
      return;
    } else {
      setErrors({
        ...errors,
        reNewPassword: false,
        newPassword: false,
        oldPassword: false,
      });
    }

    dispatch(changePasswordRequest(oldPassword, newPassword, reNewPassword));
  };
  return (
    <Background isKeyboard bout>
      <ButtonBack />
      <Loading isLoading={isLoadingChangePassword} />
      <View style={styles.contentContainer}>
        <Text style={[commonStyles.mainTitle, styles.mainTitle]}>
          Nhập mật khẩu mới
        </Text>
        <View style={styles.wrapInput}>
          <Input
            value={oldPassword}
            onChangeValue={val => setOldPassword(val)}
            props={{
              secureTextEntry: secureTextEntryOldPassword,
            }}
            placeholder="Nhập mật khẩu hiện tại"
            icon={images.icons.key}
            onPressIcon={() =>
              setSecureTextEntryOldPassword(!secureTextEntryOldPassword)
            }
          />
          {errors?.oldPassword && <TextError message={errors?.oldPassword} />}
        </View>
        <View style={styles.wrapInput}>
          <Input
            value={newPassword}
            onChangeValue={val => setNewPassword(val)}
            props={{
              secureTextEntry: secureTextEntryNewPassword,
            }}
            placeholder="Nhập mật khẩu mới"
            icon={images.icons.key}
            onPressIcon={() =>
              setSecureTextEntryNewPassword(!secureTextEntryNewPassword)
            }
          />
          {errors?.newPassword && <TextError message={errors?.newPassword} />}
        </View>
        <View style={styles.wrapInput}>
          <Input
            value={reNewPassword}
            onChangeValue={val => setReNewPassword(val)}
            props={{
              secureTextEntry: secureTextEntryReNewPassword,
            }}
            placeholder="Nhập lại mật khẩu mới"
            icon={images.icons.key}
            onPressIcon={() =>
              setSecureTextEntryReNewPassword(!secureTextEntryReNewPassword)
            }
          />
          {errors?.reNewPassword && (
            <TextError message={errors?.reNewPassword} />
          )}
        </View>
        <Button
          onPress={handleSave}
          customStyle={styles.btn}
          customLabelStyle={styles.labelBtn}
          label="Lưu lại"
        />
      </View>
    </Background>
  );
};

export default NewPassword;
