import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { getdetailgames } from "../api/gameApi";
import * as FileSystem from "expo-file-system";
import GameList from "../components/Home/GameList";
import { formatDiskSizeFromBytes } from "../utils/utils";
export default function DownloadContent() {
  const navigation = useNavigation();
  const { clearGameDownloadStatus, gameDownloadStatus } =
    useContext(AuthContext);
  const [gameIDs, setGameIDs] = useState([]);
  const [game, setGame] = useState([]);
  const [cacheSize, setCacheSize] = useState("");

  const cacheDirectory = FileSystem.documentDirectory;
  const getCacheSize = async () => {
    const calculateSizeRecursively = async (directory) => {
      const dirInfo = await FileSystem.getInfoAsync(directory, { size: true });
      if (!dirInfo.exists) return 0;
      if (!dirInfo.isDirectory) {
        return dirInfo.size;
      }
      const contents = await FileSystem.readDirectoryAsync(directory);
      const sizes = await Promise.all(
        contents.map(async (file) => {
          const filePath = `${directory}${file}`;
          return calculateSizeRecursively(filePath);
        })
      );
      return sizes.reduce((total, size) => total + size, 0);
    };

    const totalSize = await calculateSizeRecursively(cacheDirectory);
    setCacheSize(formatDiskSizeFromBytes(totalSize));
  };

  // 清理当前目录下的所有内容
  const clearDirectoryContents = async (directory) => {
    const contents = await FileSystem.readDirectoryAsync(directory);
    await Promise.all(
      contents.map(async (file) => {
        const filePath = `${directory}${file}`;
        await FileSystem.deleteAsync(filePath); // 删除当前目录下的所有内容
      })
    );
  };

  // 修改原有的清理缓存函数
  const clearCache = async () => {
    await clearDirectoryContents(cacheDirectory); // 清理缓存目录中的所有内容
    clearGameDownloadStatus(); // 清理下载状态
    getCacheSize(); // 清理后重新获取缓存大小
    ToastAndroid.show("清理成功", ToastAndroid.SHORT);
  };

  useEffect(() => {
    getCacheSize(); // 组件加载时获取缓存大小
  }, []);

  useEffect(() => {
    const ids = gameDownloadStatus.map((game) => game.id);
    setGameIDs(ids);
  }, [gameDownloadStatus]);

  useEffect(() => {
    const fetchGameDetails = async () => {
      if (gameIDs.length > 0) {
        const data = await getdetailgames(gameIDs);
        setGame(data);
      }
    };
    fetchGameDetails();
  }, [gameIDs]);

  return (
    <View style={styles.container}>
      {game && (
        <FlatList
          data={game}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate("Game", { gameID: item.id })}
            >
              <GameList game={item} ranking={index + 1} isEnabled={false} />
            </TouchableOpacity>
          )}
          onEndReachedThreshold={0.5}
        />
      )}
      <View style={styles.cleaning}>
        <Text>缓存: {cacheSize}</Text>
        <TouchableOpacity onPress={clearCache}>
          <Text>清理下载缓存</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  cleaning: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
});
