import React, {useState, useEffect} from 'react';
import {Text, Button, Background, ButtonBack, Input} from 'base';
import {View} from 'react-native';
import images from 'images';
import styles from './styles';
import {commonStyles} from 'styles';
import {useDispatch, useSelector} from 'react-redux';
import Validator from 'validatorjs';
import {changePasswordRequest, changePasswordReset} from 'actions/userActions';
import {Toast} from 'customs';
import {Loading} from 'components';
import * as RootNavigation from 'RootNavigation';

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

  useEffect(() => {
    if (dataErrors && dataErrors?.msg) {
      Toast(dataErrors?.msg);
      dispatch(changePasswordReset());
    }
  }, [dataErrors, dispatch]);

  useEffect(() => {
    if (statusChangePassword) {
      Toast('Cập nhật mật khẩu thành công');
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
        'required.reNewPassword': 'Nhập lại mật khẩu mới không đúng định dạng',
      },
    );

    if (validation.fails()) {
      setErrors({
        ...errors,
        oldPassword: validation.errors.first('oldPassword'),
        newPassword: validation.errors.first('newPassword'),
        reNewPassword: validation.errors.first('reNewPassword'),
      });
      return;
    }

    if (validation.passes()) {
      setErrors({
        ...errors,
        oldPassword: validation.errors.first('oldPassword'),
        newPassword: validation.errors.first('newPassword'),
        reNewPassword: validation.errors.first('reNewPassword'),
      });
    }

    if (newPassword !== reNewPassword) {
      setErrors({
        ...errors,
        reNewPassword: 'Nhập lại mật khẩu mới không đúng định dạng',
      });
      return;
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
              secureTextEntry: true,
            }}
            placeholder="Nhập mật khẩu hiện tại"
            icon={images.icons.key}
          />
        </View>
        <View style={styles.wrapInput}>
          <Input
            value={newPassword}
            onChangeValue={val => setNewPassword(val)}
            props={{
              secureTextEntry: true,
            }}
            placeholder="Nhập mật khẩu mới"
            icon={images.icons.key}
          />
        </View>
        <View style={styles.wrapInput}>
          <Input
            value={reNewPassword}
            onChangeValue={val => setReNewPassword(val)}
            props={{
              secureTextEntry: true,
            }}
            placeholder="Nhập lại mật khẩu mới"
            icon={images.icons.key}
          />
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
