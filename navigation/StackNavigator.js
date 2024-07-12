import React from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, TouchableOpacity, StatusBar, View, Text } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
// 导入页面组件
import Home from "../pages/Home";
import Me from "../pages/Me";
import Game from "../pages/Game";
import Search from "../pages/Search";
import Login from "../pages/Login";
import Protocol from "../components/Protocol";
import MeDetails from "../pages/MeDetails";
import ChangeName from "../components/Me/ChangeName";
import ChangeTel from "../components/Me/ChangeTel";
import UploadApk from "../components/UploadApk";
import DownloadContent from "../pages/DownloadContent";
import SetUp from "../pages/SetUp";
// import { View } from "react-native-reanimated/lib/typescript/Animated";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 创建一个底部选项卡导航器
function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <CustomHeader />,
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === "游戏") {
            iconName = focused
              ? require("../assets/Images/icon/AppIcon_Y.png")
              : require("../assets/Images/icon/AppIcon_N.png");
          } else if (route.name === "我的") {
            iconName = focused
              ? require("../assets/Images/icon/MyIcon_Y.png")
              : require("../assets/Images/icon/MyIcon_N.png");
          }

          // 你可以返回任何组件作为你的图标，这里我们使用了 Image 组件
          return <Image source={iconName} style={{ width: 20, height: 20 }} />;
        },
        tabBarLabelStyle: { marginTop: -5 }, // 这里调整文字的 marginTop
        tabBarIconStyle: { marginBottom: -5 }, // 这里调整图标的 marginBottom
        tabBarActiveTintColor: "#E8B004", // 活动状态下的字体颜色
        tabBarInactiveTintColor: "gray", // 非活动状态下的字体颜色
      })}
    >
      <Tab.Screen
        name="游戏"
        component={Home}
        options={{
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitleAlign: "center", // 标题居中
          // headerShown: false, // 隐藏顶部标题栏
        }}
      />

      <Tab.Screen
        name="我的"
        component={Me}
        options={{
          headerShown: false, // 隐藏顶部标题栏
          headerStyle: {
            backgroundColor: "#323334",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitleAlign: "center", // 标题居中
        }}
      />
    </Tab.Navigator>
  );
}

function CustomHeader() {
  const navigation = useNavigation();

  return (
    <View
      style={{
        height: wp("10%"),
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "white",
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={{
          backgroundColor: "white",
          height: wp("10%"),
          alignItems: "center",
          // paddingTop: 5,
          // marginBottom: 5,
        }}
        onPress={() => navigation.navigate("Search")}
      >
        <View
          style={{
            flex: 1,
            width: wp("80%"),
            alignItems: "center",
            flexDirection: "row", // 添加这一行
            backgroundColor: "#ededed",
            borderRadius: 5,
          }}
        >
          <Image
            source={require("../assets/Images/icon/Nav_ico_search_2.png")}
            style={{
              width: 24,
              height: 24,
              marginLeft: 10,
              marginRight: 10,
            }}
          />
          <Text
            style={{
              height: "100%",
              fontSize: 12,
              color: "gray",
              textAlignVertical: "center",
            }}
          >
            搜索应用
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        style={{
          backgroundColor: "white",
          height: wp("7%"),
          alignItems: "center",
          // paddingTop: 5,
          // marginBottom: 5,
        }}
        onPress={() => navigation.navigate("DownloadContent")}
      >
        <Image
          source={require("../assets/Images/icon/DownloadIcon.png")}
          style={{
            width: wp("7%"),
            height: wp("7%"),
            marginLeft: 10,
            // marginRight: 10,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}
// 创建一个堆栈导航器
export default function MyStack() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={BottomTabNavigator}
          options={{
            headerShown: false,
          }} // 在这里关闭标题栏
        />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="DownloadContent"
          component={DownloadContent}
          options={{ title: "下载内容" }}
        />
        <Stack.Screen name="Me" component={Me} />
        <Stack.Screen
          name="SetUp"
          component={SetUp}
          options={{ title: "设置" }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: "",
          }}
        />
        <Stack.Screen
          name="ChangeTel"
          component={ChangeTel}
          options={{
            title: "手机号换绑",
          }}
        />
        <Stack.Screen
          name="MeDetails"
          component={MeDetails}
          options={{ title: "编辑信息" }}
        />
        <Stack.Screen
          name="UploadApk"
          component={UploadApk}
          options={{ title: "上传游戏" }}
        />
        <Stack.Screen name="Game" component={Game} options={{ title: "" }} />
        <Stack.Screen
          name="Protocol"
          component={Protocol}
          options={{ title: "用户协议" }}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{
            headerLeft: () => null,
            // headerStyle: {
            //   backgroundColor: "#323334",
            // },
          }}
        />
        <Stack.Screen
          name="ChangeName"
          component={ChangeName}
          options={{
            title: "修改昵称",
            headerStyle: {
              backgroundColor: "white",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
