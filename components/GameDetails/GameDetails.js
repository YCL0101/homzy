//游戏详情组件，包含游戏封面、游戏名称、游戏标签、游戏评分、游戏平台、开发者信息、游戏下载链接等信息
import React, { useEffect, useState, useContext } from "react";
import config from "../../config";
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getGameDetail } from "../../api/gameApi";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ApkDownload from "../ApkDownload";
// import Details from "./Details";
import Evaluate from "./Evaluate";
import Strategy from "./Strategy";
import { formatDiskSize } from '../../utils/utils';
export default function GameDetails({ gameID }) {
  const Tab = createMaterialTopTabNavigator();
  const navigation = useNavigation();
  const { token, gameTags, platform } = useContext(AuthContext);
  const [game, setGame] = useState([]);

  useEffect(() => {
    getGameDetail(token, gameID)
      .then((data) => {
        setGame(data.data.detailGame);
        // console.log(data.data.detailGame);
        navigation.setOptions({ title: data.data.detailGame.nameZH1 || "" });
      })
      .catch((error) => {
        console.error("Error fetching game details:", error);
      });
  }, [game.nameZH1]);
  // 游戏标签是一个id数组
  const gameTagIds = game.tags || [];
  // 使用map函数遍历游戏标签id数组
  const gameTagNames = gameTagIds.map((tagId) => {
    // 在gameTags数组中找到对应的标签对象
    const tagObject = gameTags.find((tag) => tag.id === tagId);
    // 如果找到了对应的标签对象，返回其name，否则返回原始id
    return tagObject ? tagObject.name : tagId;
  });

  // 游戏平台匹配
  const gameOses = game.oses || [];
  const platformNames = gameOses.map((osId) => {
    const platformObject = platform.find((plat) => plat.id === osId);
    return platformObject ? platformObject.name : osId;
  });
  // console.log(game.androidDownloadUrl);
  return (
    <View style={styles.container}>
      {/* <View style={styles.divider} /> */}
      <View style={styles.information}>
        <Image
          source={{ uri: config.RESOURCE_SERVER_URL + game.iconImg }}
          style={styles.iconImg}
        />
        <View style={styles.gameInfo}>
          <Text style={{ fontWeight: "bold" }} children={game.nameZH1}></Text>
          <Text style={styles.platform}>版本 {game.versionCode || "0.0.0"} - {formatDiskSize(game.diskSize)}</Text>
          {/* <Text style={styles.platform}>开发者: {game.devCompanyName}</Text> */}
          {/* <Text style={styles.platform}>
            适配平台:{platformNames.join("/")}
          </Text> */}
        </View>

        <View style={styles.rightAlign}>
          <ApkDownload
            DownloadUrl={game.androidDownloadUrl} gameID={game.id}
          />
        </View>

        {/* <Text style={styles.gameScore}>
          {(parseFloat(game.gameScore) || 0).toFixed(1)}分
        </Text> */}
      </View>
      {/* <View style={styles.divider} /> */}
      <View style={styles.gameTagsView}>
        {gameTagNames.slice(0, 6).map((tagName, index) => (
          <Text key={index} style={styles.gameTags}>
            {tagName}
          </Text>
        ))}
      </View>
      {/* <View style={styles.divider} /> */}
      {/* <View style={styles.rightAlign}>
        <Text style={{ fontWeight: "bold" }} children="官方下载" />
        <View style={styles.downloadButton}>
          <ApkDownload DownloadUrl={game.androidDownloadUrl} />
        </View>
      </View> */}
      {/* <View style={styles.divider} /> */}
      <View style={styles.bannerImg}>
        <Image
          source={{ uri: config.RESOURCE_SERVER_URL + game.bannerImg }}
          style={{
            resizeMode: "cover",
            borderRadius: 10,
            width: "100%",
            height: "100%",
          }}
        />
      </View>
      {/* <View style={styles.divider} /> */}
      <View style={styles.shortDes}>
        <Text style={{ fontWeight: "bold" }} children="简介" />
        <Text style={styles.shortDesT}>{game.shortDes}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  information: {
    width: wp("100%"),
    height: hp("9%"),
    flexDirection: "row",
    alignItems: "center",
    padding: "5%",
  },
  bannerImg: {
    width: wp("100%"),
    height: wp("61.8%"),
    padding: "5%",
  },
  iconImg: {
    width: wp("16%"),
    height: wp("16%"),
    // marginLeft: wp("1%"),
    marginRight: wp("1%"),
  },
  gameInfo: {
    height: wp("14%"),
    width: wp("55%"),
    marginLeft: wp("1%"),
    display: "flex", // 设置为Flex容器
    justifyContent: "space-around", // 子元素之间平分空间
  },

  platform: {
    // marginTop: 10,
    fontSize: 10,
  },
  gameScore: {
    fontSize: 20,
    color: "#E8B004",
  },
  gameTagsView: {
    width: wp("100%"),
    flexDirection: "row",
    paddingLeft: "5%",
    paddingRight: "5%",
    marginTop: 5,
    marginBottom: 5,
  },
  gameTags: {
    fontSize: 12,
    padding: 2,
    backgroundColor: "#ededed",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    textAlignVertical: "center",
    marginRight: 5,
  },
  rightAlign: {
    flexDirection: "row",
    justifyContent: "space-between", // 设置为两端布局
    paddingLeft: "5%",
    paddingRight: "5%",
  },
  downloadButton: {
    width: wp("13%"),
    height: wp("6%"),
    backgroundColor: "#E8B004",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  shortDes: {
    width: wp("100%"),
    fontWeight: "bold",
    paddingLeft: "5%",
    paddingRight: "5%",
    marginBottom: 10,
  },
  shortDesT: {
    fontSize: 13,
    lineHeight: 20, // 设置行间距为20
    textAlign: "justify", // 设置文本两端对齐

  },
  divider: {
    width: "90%",
    height: 1,
    backgroundColor: "#ededed",
    // marginVertical: 10,
  },
});
