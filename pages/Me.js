import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ToastAndroid,
} from "react-native";
import Personal from "../components/Me/Personal"; // 引入个人信息组件
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import {
  getVerificationCode,
  loginByTel,
  getUserInfo,
  getUserDetail,
} from "../api/gameApi";
import { AuthContext } from "../contexts/AuthContext.js";
import config from "../config.js";
import { isEqual } from "lodash";
export default function Me() {
  const navigation = useNavigation();
  const { token, setToken, userInfo, setUserInfo, isLogin, setIsLogin } =
    useContext(AuthContext);
  // 获取用户信息
  const fetchUserInfo = useCallback(async () => {
    try {
      const response = await getUserInfo(userInfo.tel, token);
      // console.log(response);
      if (response.data.tel && !isEqual(response.data, userInfo)) {
        setUserInfo(response.data);
        setIsLogin;
      }
      if (response.status === 0) {
        setIsLogin(true);
      }else{
        setIsLogin(false);
      }
    } catch (error) {
      console.error("Error when getting user info:", error);
      // 添加更多的错误处理逻辑，例如显示一个错误消息
    }
  }, [token]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  Upload = () => {
    // 跳转到上传 APK 页面
    if (isLogin) {
      navigation.navigate("UploadApk");
    } else {
      ToastAndroid.show("请先登录", ToastAndroid.SHORT);
    }
  };
  setUp = () => {
      navigation.navigate("SetUp");
  };
  return (
    <View style={styles.container}>
      <Personal />
      <View style={styles.divider} />
      <TouchableOpacity
        activeOpacity={0.5} // 设置点击时的透明度
        onPress={Upload} // 点击后跳转
      >
        <View style={styles.navigation}>
          <Image
            source={require("../assets/Images/icon/Upload.png")}
            style={styles.icon}
          />
          <Text style={styles.text}>上传 APKS</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.5} // 设置点击时的透明度
        onPress={setUp} // 点击后跳转
      >
        <View style={styles.navigation}>
          <Image
            source={require("../assets/Images/icon/setUp.png")}
            style={styles.icon}
          />
          <Text style={styles.text}>设置</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  navigation: {
    marginLeft: wp("5%"),
    flexDirection: "row",
    alignItems: "center",
    // padding: 10,
    backgroundColor: "white",
    marginBottom: 10,
  },
  icon: {
    width: wp("8%"),
    height: wp("8%"),
  },
  text: {
    marginLeft: 10,
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "#F5F5F5",
    marginBottom: 10,
  },
});
