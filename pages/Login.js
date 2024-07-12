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
import { getVerificationCode, loginByTel, getUserInfo } from "../api/gameApi";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../contexts/AuthContext";
import config from "../config";
export default function Login() {
  const { token, setToken, userInfo, setUserInfo, setIsLogin } =
    useContext(AuthContext);
  const navigation = useNavigation();
  const [tel, setTel] = useState();
  const [code, setCode] = useState();
  const [countdown, setCountdown] = useState(60);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);

  const handleSendCode = async () => {
    if (!/^(?:(?:\+|00)86)?1\d{10}$/.test(tel)) {
      ToastAndroid.show("请输入有效的手机号", ToastAndroid.SHORT);
      // Alert.alert("请输入有效的手机号");

      return;
    }
    try {
      await getVerificationCode(tel);
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
      ToastAndroid.show("送验证码失败", ToastAndroid.SHORT);
      // Alert.alert("发送验证码失败");
    }
  };
  const handleLogin = async () => {
    if (!isAgreementChecked) {
      ToastAndroid.show("请先勾选用户协议", ToastAndroid.SHORT);

      return;
    }
    if (!tel || !code) {
      ToastAndroid.show("输入手机号和验证码", ToastAndroid.SHORT);

      return;
    }

    try {
      const response = await loginByTel(tel, code);
      console.log(response.token);
      if (!response.token) {
        ToastAndroid.show("请登录失败", ToastAndroid.SHORT);
        return;
      }
      setToken(response.token);
      // console.log(response.status);
      if (response.status === 0) {
        setIsLogin(true);
        ToastAndroid.show("登录成功", ToastAndroid.SHORT);
      }
      // console.log("Login_tel_73:", tel);
      const newUserInfo = { ...userInfo, tel: tel }; // 更新userInfo的tel
      setUserInfo(newUserInfo);
      navigation.goBack();
    } catch (error) {
      console.error(error);
      ToastAndroid.show("登录失败", ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Image
        source={require("../assets/Images/your-app.png")}
        style={styles.image}
      /> */}
      <View style={styles.hint}>
        <Text style={{ fontWeight: "bold", fontSize: 15 }}>
          手机号登录/注册
        </Text>
        <Text style={{ fontSize: 12, color: "#b0b0b0" }}>
          未注册用户验证后将自动注册并登录
        </Text>
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
        登录
      </Text>
      <View style={styles.protocol}>
        <Checkbox
          color={"#E8B004"}
          style={styles.checkbox}
          value={isAgreementChecked}
          onValueChange={setIsAgreementChecked}
        />

        <Text
          style={{
            fontSize: 12,
            height: 20,
            textAlignVertical: "center",
            textAlign: "center",
            alignSelf: "center",
          }}
        >
          勾选即代表同意鸿盟社区
        </Text>
        <Text
          style={{ color: "blue", fontSize: 12, height: 20,textAlignVertical: "center",
            textAlign: "center",
            alignSelf: "center", }}
          onPress={() => navigation.navigate("Protocol")}
        >
          《用户协议》
        </Text>
      </View>
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
  protocol: {
    width: wp("80%"),
    marginTop: hp("2%"),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  checkbox: {
    transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
    width: 20, // 设置宽度
    height: 20, // 设置高度
  },
});
