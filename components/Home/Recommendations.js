// ../pages/Recommendations.js
import React, { useEffect, useState, useContext } from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import GameRecommend from "./GameRecommend";
import { getRecommendGameList } from "../../api/gameApi";
import { useNavigation } from "@react-navigation/native";
export default function Recommendations() {
  const navigation = useNavigation();
  const { token, osType, gameTags } = useContext(AuthContext);
  const [recommendGames, setRecommendGames] = useState([]);

  // 获取推荐游戏列表
  useEffect(() => {
    getRecommendGameList(token)
      .then((data) => {
        setRecommendGames(data.data.gameList);
        // console.log(data.data.gameList);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <FlatList
      data={recommendGames}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          activeOpacity={0.5} // 设置点击时的透明度
          onPress={() => navigation.navigate("Game", { gameID: item.id })} // 点击后跳转到游戏详情页
        >
          <GameRecommend game={item} />
        </TouchableOpacity>
      )}
      onEndReachedThreshold={0.5}
    />
  );
}
