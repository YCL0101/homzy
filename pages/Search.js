import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Text,
  ScrollView,
  Animated, // 引入Animated模块
} from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { searchGame } from "../api/gameApi";
import { AuthContext } from "../contexts/AuthContext";
import GameList from "../components/Home/GameList";
import { useNavigation } from "@react-navigation/native";
export default function Search({ route }) {
  const navigation = useNavigation();
  const { token, osType, gameTagsHot, gameTags } = useContext(AuthContext);
  const [searchText, setSearchText] = useState("");
  const [game, setGame] = useState([]);
  const [tagId, setTagId] = useState(undefined);
  const [refreshCount, setRefreshCount] = useState(0);
  const [randomTags, setRandomTags] = useState([]);
  const rotateAnim = useRef(new Animated.Value(0)).current; // 新增旋转动画的状态

  useEffect(() => {
    const searchText = route.params?.searchText || "";
    setSearchText(searchText);
    const matchedTag = gameTags.find(
      (tag) => tag.name.toLowerCase() === searchText.toLowerCase()
    );
    setTagId(matchedTag ? matchedTag.id : undefined);
  }, [route.params?.searchText, gameTags]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.header}>
          <View style={styles.containerSearch}>
            <Image
              source={require("../assets/Images/icon/Nav_ico_search_2.png")}
              style={styles.icon}
            />
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="关键词/标签"
            />
          </View>
          <TouchableOpacity
            style={{ marginLeft: "3%" }}
            onPress={() => navigation.goBack()}
          >
            <Text>取消</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, searchText]);

  useEffect(() => {
    if (searchText.trim()) {
      searchGame(token, osType, searchText, tagId).then((data) => {
        setGame(data.data.gameList);
      });
    } else {
      setGame([]);
    }
  }, [searchText, tagId, token, osType]);

  const gameTagIds = gameTagsHot;
  const gameTagNames = gameTagIds.map((tagId) => {
    const tagObject = gameTags.find((tag) => tag.id === tagId);
    return tagObject ? tagObject.name : tagId;
  });

  const getRandomTags = useCallback((tags, count) => {
    let shuffled = tags.slice(0),
      i = tags.length,
      min = i - count,
      temp,
      index;
    while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(min);
  }, []);

  const handleRefresh = () => {
    rotateAnim.setValue(0); // 在动画开始前重置动画状态
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setRefreshCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    const randomTags = getRandomTags(gameTagNames, 15);
    setRandomTags(randomTags);
  }, [refreshCount]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"], // 旋转360度
  });

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate("Game", { gameID: item.id })}
      >
        <GameList
          game={item}
          osType={osType}
          ranking={index + 1}
          isEnabled={false}
        />
      </TouchableOpacity>
    );
  };

  function renderContent() {
    if (game.length === 0 && searchText.trim() === "") {
      return (
        <View style={styles.containerInitial}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text>热门标签</Text>
            <TouchableOpacity onPress={handleRefresh}>
              <Animated.Image
                source={require("../assets/Images/icon/refresh.png")}
                style={{
                  width: wp(5),
                  height: wp(5),
                  marginRight: 10,
                  transform: [{ rotate: rotation }], // 应用旋转动画
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.gameTagsView}>
            {randomTags.map((tagName, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSearchText(tagName)}
              >
                <Text style={styles.gameTags}>{tagName}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    } else {
      return (
        <FlatList
          data={game}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderItem}
          onEndReachedThreshold={0.5}
        />
      );
    }
  }

  return <View style={styles.container}>{renderContent()}</View>;
}

const styles = StyleSheet.create({
  containerInitial: {
    margin: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  gameTagsView: {
    marginTop: 10,
    // margin:10,
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "hidden",
    // backgroundColor: "red",
  },
  gameTags: {
    marginBottom: 5,
    fontSize: 10,
    marginRight: 5,
    backgroundColor: "#ededed",
    borderRadius: 5,
    padding: 2,
    textAlign: "center",
    textAlignVertical: "center",
  },
  containerSearch: {
    width: wp("80%"),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ededed",
    borderRadius: 10,
  },
  icon: {
    width: wp("6%"),
    height: wp("6%"),
    marginLeft: "5%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
  },
});
