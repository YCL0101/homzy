// 导入所需的库和组件
import React, { useContext } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Recommendations from "../components/Home/Recommendations";
import Leaderboard from "../components/Home/Leaderboard";
import Classification from "../components/Home/Classification";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, StatusBar } from "react-native";

// 创建顶部标签导航器
const Tab = createMaterialTopTabNavigator();

// 定义Home组件
export default function Home() {
  // 返回视图
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#E8B004",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "white",
            elevation: 0, // 取消Android下的阴影
          },
          tabBarPressColor: "transparent", // 取消波纹效果
          tabBarIndicatorStyle: {
            backgroundColor: "#E8B004", // 指示器颜色
          },
        }}
      >
        <Tab.Screen
          name="推荐"
          component={Recommendations}
          options={{
            swipeEnabled: true,
          }}
        />
        <Tab.Screen
          name="榜单"
          component={Leaderboard}
          options={{
            swipeEnabled: true,
          }}
        />
        <Tab.Screen
          name="分类"
          component={Classification}
          options={{
            swipeEnabled: true,
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

// 定义样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // 设置背景颜色为白色
  },
});
