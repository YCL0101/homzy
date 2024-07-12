//游戏列表渲染组件
import React, { useCallback, useContext } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import config from "../../config";
import { FontAwesome } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AuthContext } from "../../contexts/AuthContext";
import ApkDownload from "../ApkDownload";
import { formatDiskSize } from "../../utils/utils";
function GameList({ game, ranking, isEnabled = true }) {
  //isEnabled = true是否启用排名
  const score =
    game.gameScore && Number.isFinite(game.gameScore)
      ? Math.min(5, Math.max(0, Math.floor(Math.abs(game.gameScore / 2))))
      : 0;
  //   console.log("score:", score);
  const { gameTags } = useContext(AuthContext);
  // console.log("gameTags:", gameTags);
  // 游戏标签是一个id数组
  const gameTagIds = game.tags ? game.tags : []; // 确保gameTagIds总是一个数组
  // 使用map函数遍历游戏标签id数组
  const gameTagNames = gameTagIds.map((tagId) => {
    // 在gameTags数组中找到对应的标签对象
    const tagObject = gameTags.find((tag) => tag.id === tagId);
    // 如果找到了对应的标签对象，返回其name，否则返回原始id
    return tagObject ? tagObject.name : tagId;
  });

  return (
    <View style={styles.gameView}>
      {/* <View style={styles.divider} /> */}
      <View style={styles.container}>
        {isEnabled && (
          <View>
            {ranking === 1 && (
              <Image
                source={require("../../assets/Images/icon/Game_ico_001.png")}
                style={styles.rankingImage}
              />
            )}
            {ranking === 2 && (
              <Image
                source={require("../../assets/Images/icon/Game_ico_002.png")}
                style={styles.rankingImage}
              />
            )}
            {ranking === 3 && (
              <Image
                source={require("../../assets/Images/icon/Game_ico_003.png")}
                style={styles.rankingImage}
              />
            )}
            {!(ranking === 1 || ranking === 2 || ranking === 3) && (
              <View style={styles.ranking}>
                <Text
                  style={{ fontSize: ranking > 10 ? 10 : 12, color: "white" }}
                >
                  {ranking}
                </Text>
              </View>
            )}
          </View>
        )}
        <Image
          source={{ uri: config.RESOURCE_SERVER_URL + game.iconImg }}
          style={styles.image}
        />
        <View style={styles.gameInfo}>
          <Text
            style={
              game.nameZH1.length > 15 ? styles.gameNameSmall : styles.gameName
            }
          >
            {game.nameZH1}
          </Text>
          <Text style={styles.versionCode}>
            版本 {game.versionCode || "0.0.0"} - {formatDiskSize(game.diskSize)}
          </Text>
          {/* <View style={styles.starContainer}>
            {[...Array(Math.floor(score))].map((_, i) => (
              <FontAwesome
                key={i}
                name="star"
                size={8}
                color="#E8B004"
                style={{ marginRight: 2 }}
              />
            ))}
            {score % 1 !== 0 && (
              <FontAwesome
                name="star-half-o"
                size={8}
                color="#E8B004"
                style={{ marginRight: 2 }}
              />
            )}
            {[...Array(Math.floor(5 - Math.ceil(score)))].map((_, i) => (
              <FontAwesome
                key={i + Math.ceil(score)}
                name="star-o"
                size={8}
                color="#E8B004"
                style={{ marginRight: 2 }}
              />
            ))}
            <Text style={styles.gameScore}>
              {parseFloat(game.gameScore || 0).toFixed(1)}分
            </Text>
          </View> */}
          <View style={styles.gameTagsView}>
            {gameTagNames.slice(0, 3).map((tagName, index) => (
              <Text key={index} style={styles.gameTags}>
                {tagName}
              </Text>
            ))}
          </View>
        </View>
        <View style={styles.rightAlign}>
          <ApkDownload DownloadUrl={game.androidDownloadUrl} gameID={game.id} />
          {/* <Text style={{ fontSize: 10, marginTop: 10 }}>查看攻略</Text> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gameView: {
    width: wp("100%"),
    backgroundColor: "white",
    justifyContent: "center", // 添加这一行
  },
  container: {
    width: wp("100%"),
    height: wp("25%"),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // 添加这一行
  },
  ranking: {
    width: wp("6%"),
    height: wp("6%"),
    borderRadius: 100,
    backgroundColor: "#828282",
    marginLeft: wp("3%"),
    marginRight: wp("2%"),
    justifyContent: "center",
    alignItems: "center",
  },
  rankingImage: {
    width: wp("6%"),
    height: wp("7%"),
    marginLeft: wp("3%"),
    marginRight: wp("2%"),
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: wp("16%"),
    height: wp("16%"),
    marginLeft: wp("1%"),
    marginRight: wp("1%"),
  },
  gameInfo: {
    height: wp("16%"),
    width: wp("50%"),
    marginLeft: wp("1%"),
    display: "flex", // 设置为Flex容器
    justifyContent: "space-around", // 子元素之间平分空间
  },
  gameName: {
    width: wp("70%"),
    fontSize: 14,
    zIndex: -1,
  },
  gameNameSmall: {
    fontSize: 10,
  },
  versionCode: {
    fontSize: 9,
    color: "#828282",
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  gameScore: {
    fontSize: 11,
    color: "#E8B004",
    // paddingLeft: 5,
  },
  gameTagsView: {
    width: wp("30%"),
    flexDirection: "row",
  },
  gameTags: {
    fontSize: 9,
    // paddingRight: 5,
    backgroundColor: "#ededed",
    borderRadius: 3,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },

  rightAlign: {
    // marginRight: wp("1%"),
    flexDirection: "row",
    justifyContent: "flex-end",
    // marginRight: wp("3%"),
    flexDirection: "column",
  },
  downloadButton: {
    width: wp("13%"),
    height: wp("6%"),
    backgroundColor: "#E8B004",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#ededed",
    // marginVertical: 10,
  },
});

export default React.memo(GameList);
