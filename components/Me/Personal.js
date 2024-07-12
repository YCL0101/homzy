import React, { useContext, useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import config from "../../config";
export default function Personal() {
  const navigation = useNavigation();
  const { token, userInfo, isLogin } = useContext(AuthContext);
  const defaultImage = require("../../assets/Images/icon/DefaultAvatar.png");
  
  // console.log(userInfo);
  const handlePressLogin = useCallback(() => {
    navigation.navigate("Login");
  }, []);

  const handlePressMeDetails = useCallback(() => {
    navigation.navigate("MeDetails");
  }, []);
// useEffect(() => {
//   console.log("isLogin:", isLogin);
//   // 这个 useEffect 会在 isLogin 变化时重新运行，以确保每次 isLogin 更新时都会重新判断其是否为 undefined
// }, [isLogin]);
  return (
    <View style={styles.frame}>
      {typeof isLogin !== "undefined" &&
        (isLogin ? (
          <View>
            <TouchableOpacity onPress={handlePressMeDetails}>
              <View style={styles.container}>
                <Image
                  source={
                    userInfo.headimgurl
                      ? {
                          uri: config.RESOURCE_SERVER_URL + userInfo.headimgurl,
                        }
                      : defaultImage
                  }
                  style={styles.avatar}
                />
                <View style={styles.info}>
                  <Text style={styles.nickname}>{userInfo.nickname}</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.detailLevel}>Lv.{userInfo.level}</Text>
                    <Text style={styles.detailId}>ID:{userInfo.uid}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handlePressLogin}>
            <View style={styles.containerNot}>
              <Text>立即登录</Text>
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { height: wp("40%") },
  containerNot: {
    flexDirection: "row",
    marginTop: wp("15%"),
    marginBottom: wp("15%"),
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    height: wp("15%"),
    flexDirection: "row",
    marginTop: wp("15%"),
    marginBottom: wp("15%"),
    marginLeft: wp("5%"),
  },
  avatar: {
    width: wp("15%"),
    height: wp("15%"),
    borderRadius: 50,
    // backgroundColor: "black",
  },
  info: {
    width: wp("60%"),
    height: wp("15%"),
    marginLeft: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  nickname: {
    fontSize: 18,
    fontWeight: "bold",
    // paddingBottom: 10,
  },
  detailLevel: {
    fontWeight: "bold",
    height: "100%",
    fontSize: 8,
    backgroundColor: "#E8B004",
    color: "white",
    borderRadius: 5,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: "center",
    textAlignVertical: "center",
  },
  detailId: {
    fontWeight: "bold",
    // height: "100%",
    fontSize: 11,
    borderRadius: 5,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: "center",
    // textAlignVertical: "center",
    color: "#666",
  },
});
