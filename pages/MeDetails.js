// 导入所需的库和组件
import React, { useContext, useState, useEffect, useCallback } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AuthContext } from "../contexts/AuthContext";
import config from "../config";
import { changeUserInfo } from "../api/gameApi";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native";
import ChangeSex from "../components/Me/ChangeSex";
// 定义 MeDetails 组件
function MeDetails() {
  // 使用 React Navigation 的钩子函数获取 navigation 对象
  const navigation = useNavigation();

  // 从 AuthContext 中获取 token 和 userInfo，以及它们的 setter 函数
  const { token, setToken, userInfo, setUserInfo, setIsLogin } =
    useContext(AuthContext);

  // 定义一些 state
  const [showsex, setShowsex] = useState(false);

  // 定义 params state，用于存储用户信息
  const [params, setParams] = useState({
    headimgbase64: null,
    token: token,
  });

  // 定义默认的头像图片
  const defaultImage = require("../assets/Images/icon/DefaultAvatar.png");

  // 定义一个函数，用于从图库中选择图片
  const chooseImage = useCallback(async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    handleImageSelection(result);
  }, []);

  // 定义一个函数，用于处理图片选择
  const handleImageSelection = useCallback(async (result) => {
    if (!result.canceled) {
      const newImageUri = result.assets[0].uri;
      const base64Image = await FileSystem.readAsStringAsync(newImageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 更新 params state
      setParams((prevParams) => ({
        ...prevParams,
        headimgbase64: base64Image,
      }));
    }
  }, []);

  // 使用 useEffect 钩子函数，当 params 更新时，调用 API 更改用户头像
  useEffect(() => {
    const changeInfo = async () => {
      try {
        let response = await changeUserInfo(params);
        // 更新 userInfo state
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          headimgurl: response.headimgurl,
        }));
      } catch (error) {
        console.error("Error when changing user info:", error);
      }
    };

    if (params.headimgbase64) {
      changeInfo();
    }
  }, [params]);

  // 定义一些函数，用于处理按钮点击事件
  const handleOpenSex = () => {
    setShowsex(true);
  };
  const handleOpenTel = (oldtel) => {
    navigation.navigate("ChangeTel", { oldtel: oldtel });
  };
  const logout = () => {
    setToken(null);
    setIsLogin(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={chooseImage}>
        <Image
          style={styles.avatar}
          source={
            userInfo.headimgurl
              ? { uri: config.RESOURCE_SERVER_URL + userInfo.headimgurl }
              : defaultImage
          }
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          navigation.navigate("ChangeName");
        }}
      >
        <Text style={styles.label}>昵称</Text>
        <Text style={styles.text}>{userInfo.nickname}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.row} onPress={handleOpenSex}>
        <Text style={styles.label}>性别</Text>
        <Text style={styles.text}>{userInfo.sex === 1 ? "男" : "女"}</Text>
      </TouchableOpacity>
      {showsex && <ChangeSex showsex={showsex} setShowsex={setShowsex} />}
      <TouchableOpacity
        style={styles.row}
        onPress={() => handleOpenTel(userInfo.tel)}
      >
        <Text style={styles.label}>手机</Text>
        <Text style={styles.text}>{userInfo.tel}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>退出登录</Text>
      </TouchableOpacity>
    </View>
  );
}

export default MeDetails;

// 定义样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  avatar: {
    width: wp("20%"),
    height: wp("20%"),
    borderRadius: wp("10%"),
    marginBottom: hp("5%"),
    marginTop: hp("5%"),
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: wp("5%"),
    marginBottom: 1,
    backgroundColor: "white",
  },
  label: {
    fontSize: hp("2%"),
  },
  text: {
    fontSize: hp("2%"),
  },
  logoutButton: {
    marginTop: hp("4%"),
    padding: hp("1%"),
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    paddingLeft: wp("25%"),
    paddingRight: wp("25%"),
  },
  logoutText: {
    textAlign: "center",
  },
});
