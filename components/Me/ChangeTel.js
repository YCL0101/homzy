import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Button,
  Alert,
  Image,
  ToastAndroid,
} from "react-native";
import Checkbox from "expo-checkbox";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  getVerificationCode,
  loginByTel,
  getUserInfo,
  changeTel,
  getBindTelCode,
} from "../../api/gameApi";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexts/AuthContext";

export default function ChangeTel({ route }) {
  const { token, setToken, userInfo, setUserInfo } = useContext(AuthContext);
  const navigation = useNavigation();
  const [tel, setTel] = useState();
  const [code, setCode] = useState();
  const [countdown, setCountdown] = useState(60);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const { oldtel } = route.params;
  // console.log(oldtel);
  const handleSendCode = async () => {
    if (!/^(?:(?:\+|00)86)?1\d{10}$/.test(tel)) {
      ToastAndroid.show("请输入有效的手机号", ToastAndroid.SHORT);
      // Alert.alert("请输入有效的手机号");
      return;
    }

    if (tel === oldtel) {
      ToastAndroid.show("新手机号不能与旧手机号相同", ToastAndroid.SHORT);
      // Alert.alert("新手机号不能与旧手机号相同");
      return;
    }
    try {
      const response = await getBindTelCode(tel, token);
      console.log(response);
      if (response.status !== 0) {
        ToastAndroid.show(response.data, ToastAndroid.SHORT);
        // Alert.alert(response.data);
        return;
      }
      setIsCountingDown(true);
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            setIsCountingDown(false);
            return 60;
          } else {
            return prevCountdown - 1;
          }
        });
      }, 1000);
    } catch (error) {
      ToastAndroid.show("发送验证码失败", ToastAndroid.SHORT);
      // Alert.alert("发送验证码失败");
    }
  };
  const handleLogin = async () => {
    if (!tel || !code) {
      ToastAndroid.show("输入手机号和验证码", ToastAndroid.SHORT);
      // Alert.alert("请输入手机号和验证码");
      return;
    }

    try {
      const response = await changeTel(tel, code, token);
      console.log(response.status);
      if (response.status !== 0) {
        ToastAndroid.show("绑定失败", ToastAndroid.SHORT);
        // Alert.alert("绑定失败");
        return;
      }
      ToastAndroid.show("绑定成功", ToastAndroid.SHORT);
      // alert("绑定成功");
      // const newUserInfo = { ...userInfo, tel: tel }; // 更新userInfo的tel
      // setUserInfo(newUserInfo);
      navigation.goBack();
    } catch (error) {
      console.error(error);
      ToastAndroid.show("绑定失败", ToastAndroid.SHORT);
      // Alert.alert("绑定失败");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.hint}>
        {/* <Text style={{ fontWeight: "bold", fontSize: 15 }}>
        更换手机号码
      </Text> */}
        {/* <Text style={{ fontSize: 12, color: "#b0b0b0" }}>
        未注册用户验证后将自动注册并登录
      </Text> */}
      </View>
      <View style={styles.loginInput}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="手机号"
            style={styles.input}
            onChangeText={setTel}
            value={tel}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="验证码"
            style={styles.input}
            onChangeText={setCode}
            value={code}
          />
          <TouchableOpacity
            style={styles.codeContainer}
            onPress={handleSendCode}
            disabled={isCountingDown}
          >
            <Text style={styles.codeText}>
              {isCountingDown ? `${countdown}秒后重试` : "发送"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.loginButton} onPress={handleLogin}>
        确认
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "center",
    backgroundColor: "white",
  },
  hint: {
    width: wp("80%"),
    // marginBottom: hp("5%"),
    marginTop: hp("15%"),
    marginBottom: hp("5%"),
  },
  loginInput: {},

  input: {
    width: wp("60%"),
    height: 40,
    // marginBottom: hp("2%"),
    paddingLeft: wp("2%"),
  },

  inputContainer: {
    width: wp("80%"),
    height: 40,
    borderColor: "#d6d6d6",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  codeText: {
    color: "#E8B004",
    textAlign: "center",
  },
  codeContainer: {
    height: 40,
    justifyContent: "center",
  },
  loginButton: {
    width: wp("80%"),
    height: 40,
    backgroundColor: "#E8B004",
    color: "white",
    textAlign: "center",
    lineHeight: 40,
    borderRadius: 5,
    marginTop: hp("5%"),
  },
});
