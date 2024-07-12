// AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import { Platform, AppState } from "react-native";
import { getTagsByTagsIds, guestLogin } from "../api/gameApi";
import * as Application from "expo-application";
import * as SecureStore from "expo-secure-store"; // 引入expo-secure-store库
import AsyncStorage from "@react-native-async-storage/async-storage";
// 创建认证上下文
export const AuthContext = createContext();

// 认证提供者组件
export const AuthProvider = ({ children }) => {
  // 定义状态和状态设置函数
  const [token, setToken] = useState(null); // 初始化为null
  const [osType, setOsType] = useState();
  const [gameTags, setGameTags] = useState([]); //用于存储游戏标签信息
  const [gameTagsHot, setGameTagsHot] = useState([]); //用于存储热门游戏标签信息
  const [userInfo, setUserInfo] = useState({});
  const [isLogin, setIsLogin] = useState();
  const [gameDownloadStatus, setGameDownloadStatus] = useState([]); //下载状态
  const [isEnabled, setIsEnabled] = useState(false); //浏览器下载开关

  const platform = [
    { id: 1, name: "Win" },
    { id: 2, name: "Mac" },
    { id: 3, name: "Linux" },
    { id: 4, name: "Android" },
    { id: 5, name: "IOS" },
  ]; // 适配平台类型1：win，2：mac，3：linux，4：android，5：iOS
  //设置
  // 使用useEffect钩子，在组件加载时获取存储的值
  useEffect(() => {
    const fetchIsEnabled = async () => {
      const storedIsEnabled = await SecureStore.getItemAsync(
        "browserDownloadSwitch"
      );
      if (storedIsEnabled !== null) {
        setIsEnabled(JSON.parse(storedIsEnabled)); // 将字符串转换回布尔值
      }
    };

    fetchIsEnabled();
  }, []);
  // 当isEnabled状态改变时，使用useEffect钩子更新存储的值
  useEffect(() => {
    SecureStore.setItemAsync(
      "browserDownloadSwitch",
      JSON.stringify(isEnabled)
    );
  }, [isEnabled]);
  // 获取并设置标签
  const fetchAndSetTags = useCallback(async () => {
    const data = await getTagsByTagsIds();
    setGameTags(data.data.tagsData);
    setGameTagsHot(data.data.hotTagsIds);
  }, []);

  // 获取并设置用户手机号
  const fetchAndSetUserInfo = useCallback(async () => {
    const tel = await SecureStore.getItemAsync("user_info_tel");
    // console.log("tel", tel);
    if (tel) {
      const parsedTel = JSON.parse(tel).tel;
      setUserInfo({ tel: parsedTel });
    }
  }, []);

  // 获取并设置令牌
  const fetchAndSetToken = useCallback(async () => {
    const storedToken = await SecureStore.getItemAsync("token");
    // console.log("storedToken", storedToken);

    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // 初始化操作
  useEffect(() => {
    setOsType(4);
    fetchAndSetTags();
    fetchAndSetUserInfo();
    fetchAndSetToken();
  }, [fetchAndSetTags, fetchAndSetUserInfo, fetchAndSetToken]);
  // 更新用户手机号
  const updateUserInfo = useCallback(async (info) => {
    try {
      // 确保值为字符串
      const infoStr = JSON.stringify({ tel: info });
      await SecureStore.setItemAsync("user_info_tel", infoStr);
    } catch (error) {
      console.error("Failed to update user info in SecureStore:", error);
    }
  }, []);

  // 当用户电话改变时，更新用户信息
  useEffect(() => {
    updateUserInfo(userInfo.tel);
  }, [userInfo.tel, updateUserInfo]);

  // 更新存储中的令牌
  const updateTokenInStore = useCallback(async () => {
    try {
      if (token) {
        // 确保值为字符串
        // const tokenStr = JSON.stringify(token);
        await SecureStore.setItemAsync("token", token);
      } else {
        await SecureStore.deleteItemAsync("token");
      }
    } catch (error) {
      console.error("Failed to update token in SecureStore:", error);
    }
  }, [token]);

  // 当令牌改变时，更新存储中的令牌
  useEffect(() => {
    updateTokenInStore();
  }, [token, updateTokenInStore]);
  // 从本地存储获取游戏下载状态
  useEffect(() => {
    const fetchGameDownloadStatus = async () => {
      const statusJson = await AsyncStorage.getItem("gameDownloadStatus");
      if (statusJson) {
        setGameDownloadStatus(JSON.parse(statusJson));
      }
    };

    fetchGameDownloadStatus();
  }, []);

  // 游戏下载状态更新时，保存到本地存储
  useEffect(() => {
    // console.log("gameDownloadStatus", gameDownloadStatus);
    const saveGameDownloadStatus = async () => {
      await AsyncStorage.setItem(
        "gameDownloadStatus",
        JSON.stringify(gameDownloadStatus)
      );
    };

    saveGameDownloadStatus();
  }, [gameDownloadStatus]);

  const updateGameDownloadStatus = useCallback(
    (gameId, status, progress = 0) => {
      setGameDownloadStatus((prevStatus) => {
        const index = prevStatus.findIndex((game) => game.id === gameId);
        if (index !== -1) {
          const currentGame = prevStatus[index];
          // 检查status和progress是否有变化
          const isStatusChanged =
            status !== null && currentGame.status !== status;
          const isProgressChanged = currentGame.progress !== progress;
          // 如果两者都没有变化，则不更新
          if (!isStatusChanged && !isProgressChanged) {
            return prevStatus;
          }
          // 根据变化更新相应字段，但当status为null时不更新status字段
          const updatedGame = {
            ...currentGame,
            ...(isStatusChanged && { status }),
            ...(isProgressChanged && { progress }),
          };
          const updatedStatus = [...prevStatus];
          updatedStatus[index] = updatedGame;
          return updatedStatus;
        } else {
          // 当添加新游戏时，如果status不为null，则包括status和progress信息
          const newGame = { id: gameId, progress };
          if (status !== null) {
            newGame.status = status;
          }
          return [...prevStatus, newGame];
        }
      });
    },
    []
  );
  //添加一个清空下载状态的函数
  const clearGameDownloadStatus = useCallback(() => {
    setGameDownloadStatus([]); // 清空游戏下载状态数组
    AsyncStorage.removeItem("gameDownloadStatus"); // 从本地存储中移除游戏下载状态
  }, []);
  // 监听应用状态变化
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "background") {
        // 应用进入后台，自动将下载中的状态改为暂停
        const updatedStatus = gameDownloadStatus.map((game) => {
          if (game.status === 1) {
            // 如果游戏状态为下载中
            return { ...game, status: 2 }; // 将状态改为暂停
          }
          return game;
        });
        setGameDownloadStatus(updatedStatus); // 更新状态
        AsyncStorage.setItem(
          "gameDownloadStatus",
          JSON.stringify(updatedStatus)
        ); // 保存到本地存储
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove(); // 使用返回的订阅对象上的remove方法来移除监听器
    };
  }, [gameDownloadStatus]);
  // 返回认证提供者组件
  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        osType,
        setOsType,
        gameTags,
        gameTagsHot,
        platform,
        userInfo,
        setUserInfo,
        isLogin,
        setIsLogin,
        gameDownloadStatus,
        updateGameDownloadStatus,
        clearGameDownloadStatus,
        isEnabled,
        setIsEnabled,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
