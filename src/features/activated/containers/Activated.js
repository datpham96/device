import React, {useState} from 'react';
import {Text, Background, Button, Input, ButtonBack} from 'base';
import {ScrollView, View} from 'react-native';
import styles from './styles';
import {commonStyles} from 'styles';
import {PopupAlert, TextError} from 'components';
import Validator from 'validatorjs';

const Activated = () => {
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState({});
  const handleUpdate = () => {
    const validation = new Validator(
      {
        name: code,
      },
      {
        code: 'required',
      },
      {
        'required.code': 'Bản quyền không hợp lệ vui lòng nhập lại',
      },
    );

    if (validation.fails()) {
      setErrors({...errors, name: validation.errors.first('name')});
      return;
    }

    if (validation.passes()) {
      setErrors({...errors, name: validation.errors.first('name')});
    }

    //update avatar
  };

  return (
    <Background bout>
      <ButtonBack />
      {/* <Loading
        isLoading={
          isLoadingLogout ||
          isLoadingUpdateUserAvatar ||
          isLoadingUpdateUserInfo
        }
      /> */}
      <PopupAlert
        content="Bản quyền của bạn đã kích hoạt thành công"
        visible={false}
      />
      <ScrollView style={styles.container}>
        <Text style={[commonStyles.mainTitle, styles.mainTitleStyle]}>
          Bản quyền sử dụng
        </Text>
        <View style={styles.wrapDateNumber}>
          <Text style={styles.dateNumber}>121</Text>
          <Text style={styles.dateLabel}>Ngày</Text>
        </View>
        <Text style={styles.descriptionTime}>Thời gian sử dụng ứng dụng</Text>
        <View style={styles.wrapInput}>
          <Input
            customerInput={styles.customInput}
            value={code}
            onChangeValue={val => setCode(val)}
            placeholder="Nhập mã"
          />
          {errors?.name && <TextError message={errors?.name} />}
        </View>
        <View style={styles.wrapBtn}>
          <Button
            customStyle={styles.btn}
            onPress={handleUpdate}
            label="Lưu lại"
          />
        </View>
        <Text style={styles.expiredDate}>Ngày hết hạn: 30/03/2022</Text>
      </ScrollView>
    </Background>
  );
};

export default Activated;
