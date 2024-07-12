//游戏详情组件，包含游戏封面、游戏名称、游戏标签、游戏评分、游戏平台、开发者信息、游戏下载链接等信息
import React, { useEffect, useState, useContext } from "react";
import config from "../../config";
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ApkDownload from "../ApkDownload";
import { formatDiskSize } from '../../utils/utils';
function GameRecommend({ game }) {
  const { gameTags, platform } = useContext(AuthContext);

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

  return (
    <View style={styles.outer}>
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
      <View style={styles.container}>
        <Image
          source={{ uri: config.RESOURCE_SERVER_URL + game.iconImg }}
          style={styles.image}
        />
        <View style={styles.gameInfo}>
          <Text style={{ fontWeight: "bold" }} children={game.nameZH1}></Text>
          <Text style={styles.platform}>版本 {game.versionCode || "0.0.0"} - {formatDiskSize(game.diskSize)}</Text>
          <Text style={styles.platform}>开发者:{game.devCompanyName}</Text>
        </View>
        {/* <Text style={styles.gameScore}>
          {parseFloat(game.gameScore).toFixed(1)}分
        </Text> */}
        <ApkDownload
          DownloadUrl={game.androidDownloadUrl}
          gameID={game.id}
        />
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
        <TouchableOpacity style={styles.downloadButton}>
          <Text>下载</Text>
        </TouchableOpacity>
      </View> */}
      {/* <View style={styles.divider} /> */}
      <View style={styles.shortDes}>
        <Text style={{ fontWeight: "bold" }} children="游戏简介" />
        <Text style={styles.shortDesT} numberOfLines={6}>
          {game.shortDes}
        </Text>
      </View>
      {/* <View style={styles.divider} /> */}
    </View>
  );
}
const styles = StyleSheet.create({
  outer: {
    backgroundColor: "#fff",
    margin: "2%",
    paddingBottom: "2%",
    borderRadius: 10,
    alignItems: "center",
  },
  container: {
    width: wp("100%"),
    height: hp("9%"),
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp("0.25%"),
    marginBottom: hp("0.25%"),
    padding: "5%",
  },
  bannerImg: {
    width: wp("100%"),
    height: wp("61.8%"),
    padding: "5%",
  },
  image: {
    width: wp("16%"),
    height: wp("16%"),
    // marginLeft: wp("1%"),
    marginRight: wp("1%"),
  },
  gameInfo: {
    height: wp("16%"),
    width: wp("55%"),
    marginLeft: wp("1%"),
    display: "flex", // 设置为Flex容器
    justifyContent: "space-around", // 子元素之间平分空间
    // 其他必要的样式...
  },
  platform: {
    fontSize: 10,
    color: "#666",
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
    fontSize: 10,
    padding: 2,
    backgroundColor: "#ededed",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    textAlignVertical: "center",
    marginRight: 5,
  },
  rightAlign: {
    width: wp("100%"),
    flexDirection: "row",
    justifyContent: "space-between",
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
  },
  shortDesT: {
    fontSize: 13,
    lineHeight: 20,
  },
  divider: {
    width: "98%",
    height: 1,
    backgroundColor: "#ededed",
    // marginVertical: 10,
  },
});
export default React.memo(GameRecommend);
