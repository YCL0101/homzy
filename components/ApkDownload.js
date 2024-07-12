import React, { useState, useCallback, useContext, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Linking,
  ToastAndroid,
} from "react-native";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import * as IntentLauncher from "expo-intent-launcher";
import { AuthContext } from "../contexts/AuthContext";
import { formatDiskSizeFromBytes, throttle } from "../utils/utils";
import { downloadCount } from "../api/gameApi";

export default function ApkDownload({ DownloadUrl, gameID }) {
  const [downloadResumable, setDownloadResumable] = useState(null);
  const [progress, setProgress] = useState(0);
  const { updateGameDownloadStatus, gameDownloadStatus, isEnabled } =
    useContext(AuthContext);
  const [downloadStatus, setDownloadStatus] = useState(0);
  const throttledUpdateGameDownloadStatus = throttle(
    updateGameDownloadStatus,
    1000
  ); // 假设我们节流时间为1000毫秒
  useEffect(() => {
    const gameInfo = gameDownloadStatus.find((game) => game.id === gameID);

    const status = gameInfo ? gameInfo.status : 0;
    const progress = gameInfo ? gameInfo.progress : 0;
    setProgress(progress);
    setDownloadStatus(status);
  }, [gameID, gameDownloadStatus]);

  const BrowserDownload = async () => {
    // 检查是否可以打开URL
    const canOpen = await Linking.canOpenURL(DownloadUrl);
    if (canOpen) {
      Linking.openURL(DownloadUrl).catch((err) => {
        console.error("An error occurred", err);
      });
    } else {
      ToastAndroid.show("无法打开链接", ToastAndroid.SHORT);
    }
  };
  const requestStoragePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "存储权限请求",
            message: "应用需要访问您的存储来下载文件",
            buttonNeutral: "稍后询问",
            buttonNegative: "取消",
            buttonPositive: "确定",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  async function pauseDownloadAndSaveProgress() {
    updateGameDownloadStatus(gameID, 2);
    if (downloadResumable) {
      const pauseResult = await downloadResumable.pauseAsync();
      if (pauseResult && pauseResult.resumeData) {
        try {
          // 使用游戏ID生成唯一键
          updateGameDownloadStatus(gameID, 2);
          const resumeDataKey = "downloadResumeData_" + gameID;
          await AsyncStorage.setItem(resumeDataKey, pauseResult.resumeData);
          console.log("下载进度已保存");
        } catch (error) {
          console.error("保存下载进度失败", error);
        }
      }
    }
  }
  useEffect(() => {
    const pauseIfWaiting = async () => {
      if (downloadStatus === 2) {
        await pauseDownloadAndSaveProgress(); // 如果是，则暂停下载
      }
    };
    pauseIfWaiting(); // 调用函数
  }, [downloadStatus]); // 依赖于downloadStatus的变化
  const handleResume = async () => {
    const downloadingGame = gameDownloadStatus.find((e) => e.status === 1);
    if (downloadingGame) {
      updateGameDownloadStatus(downloadingGame.id, 2);
    }
    const resumeDataKey = "downloadResumeData_" + gameID;
    const resumeDataString = await AsyncStorage.getItem(resumeDataKey);
    if (resumeDataString) {
      try {
        updateGameDownloadStatus(gameID, 1);
        const newDownloadResumable = FileSystem.createDownloadResumable(
          DownloadUrl,
          `${FileSystem.documentDirectory}${gameID}.apk`,
          {},
          (downloadProgress) => {
            const progressRenew =
              downloadProgress.totalBytesWritten /
              downloadProgress.totalBytesExpectedToWrite;
            // setProgress(progress);
            if (progressRenew >= 0.99) {
              // 使用大于等于0.99来判断是否完成
              console.log("下载完成");
              updateGameDownloadStatus(gameID, 3);
              // setDownloadStatus(3);
            }
            throttledUpdateGameDownloadStatus(
              gameID,
              null,
              progressRenew.toFixed(2)
            );
          },
          resumeDataString // 使用保存的resumeData字符串
        );
        // 使用新的DownloadResumable对象恢复下载
        setDownloadResumable(newDownloadResumable);
        await newDownloadResumable.resumeAsync();
      } catch (error) {
        console.error("恢复下载失败", error);
      }
    } else {
      console.log("没有找到下载进度数据，无法恢复下载");
    }
  };

  const handleInstall = async (uri) => {
    const contentUri = await FileSystem.getContentUriAsync(uri);
    console.log(uri);
    IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
      data: contentUri,
      type: "application/vnd.android.package-archive",
      flags: 1,
    }).catch((e) => console.error(e));
  };

  const handleDownload = useCallback(
    async (DownloadUrl, gameID) => {
      downloadCount(gameID);
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        console.log("没有存储权限");
        return;
      }
      const downloadingGame = gameDownloadStatus.find((e) => e.status === 1);
      if (downloadingGame) {
        updateGameDownloadStatus(downloadingGame.id, 2);
      }
      const fileUri = `${FileSystem.documentDirectory}${gameID}.apk`;
      const directoryInfo = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory
      );
      if (!directoryInfo.exists) {
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory, {
          intermediates: true,
        });
      }
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      const headers = fileInfo.exists
        ? { Range: `bytes=${fileInfo.size}-` }
        : {};
      const newDownloadResumable = FileSystem.createDownloadResumable(
        DownloadUrl,
        fileUri,
        { headers },
        (downloadProgress) => {
          const progressRenew =
            downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite;
          // setProgress(progress.toFixed(2));
          if (progressRenew >= 0.99) {
            // 使用大于等于0.99来判断是否完成
            console.log("下载完成");
            updateGameDownloadStatus(gameID, 3);
            // setDownloadStatus(3);
          }
          throttledUpdateGameDownloadStatus(
            gameID,
            null,
            progressRenew.toFixed(2)
          );
        }
      );

      try {
        setDownloadResumable(newDownloadResumable);
        updateGameDownloadStatus(gameID, 1);
        await newDownloadResumable.downloadAsync();
      } catch (e) {
        console.error(e);
      }
    },
    [requestStoragePermission, updateGameDownloadStatus]
  );

  // useEffect(() => {
  //   // console.log(gameID + "      " + progress);
  //   // updateGameDownloadStatus(gameID, 3, progress);
  //   if (progress >= 0.99) {
  //     // 使用大于等于0.99来判断是否完成
  //     console.log("下载完成");
  //     updateGameDownloadStatus(gameID, 3);
  //     setDownloadStatus(3);
  //   }
  // }, [progress, gameID]);

  return (
    <View style={{ alignItems: "center" }}>
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => {
          if (downloadStatus === 0) {
            if (isEnabled) {
              BrowserDownload();
            } else {
              handleDownload(DownloadUrl, gameID);
            }
          } else if (downloadStatus === 1) {
            pauseDownloadAndSaveProgress();
          } else if (downloadStatus === 2) {
            handleResume();
          } else if (downloadStatus === 3) {
            handleInstall(`${FileSystem.documentDirectory}${gameID}.apk`);
          }
        }}
      >
        {downloadStatus === 1 ? (
          <Text>{Math.round(progress * 100)}%</Text>
        ) : downloadStatus === 2 ? (
          <Text>暂停</Text>
        ) : downloadStatus === 3 ? (
          <Text>安装</Text>
        ) : (
          <Text>下载</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  downloadButton: {
    width: wp("15%"),
    backgroundColor: "#E8B004",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 5,
    paddingRight: 5,
  },
});
