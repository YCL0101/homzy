// 导入外部库
import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
} from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
  Swiper,
  images,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
// 导入内部模块
import { AuthContext } from "../../contexts/AuthContext";
import { getGameInfo, getTagsByTagsIds } from "../../api/gameApi";
import GameList from "./GameList";

export default function Leaderboard() {
  const navigation = useNavigation();
  const { token, osType, gameTagsHot, gameTags } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("综合");
  const [sortType, setSortType] = useState(1);
  const [reqCnt, setReqCnt] = useState(10);
  const [gameLists, setGameLists] = useState(
    Array.from({ length: 7 }, () => [])
  );
  const [viewLayout, setViewLayout] = useState({
    x: -100,
    y: -100,
    width: 0,
    height: 0,
  });
  const [flagIds, setFlagIds] = useState(Array.from({ length: 7 }, () => 0));
  // 排序选项列表
  const OPTIONS = ["综合", "新鲜度", "热度", "下载量"];

  // 处理选择不同选项的函数
  const handleSelectOption = (option, newSortType) => {
    setSelectedOption(option);
    // 首先设置模态框的可见性
    handleToggleModal();
    // 如果选择的选项与当前排序类型不同，则更新排序类型
    if (newSortType !== sortType) {
      setSortType(newSortType);
      // getGameList(newSortType);
    }
  };

  // 切换模态框可见性的函数
  const handleToggleModal = () => {
    if (!modalVisible) {
      viewRef.current.measureInWindow((x, y, width, height) => {
        setViewLayout({ x, y, width, height });
        // console.log(x, y, width, height);
      });
    }
    setModalVisible(!modalVisible);
    // 当模态框打开时，获取viewRef的位置和尺寸
  };

  // 获取游戏列表的函数
  const getGameList = (sortType) => {
    const currentFlagId = flagIds[sortType];
    getGameInfo(osType, token, currentFlagId, reqCnt, sortType)
      .then((data) => {
        // console.log("1");
        const newGames = data.data.gameList || [];
        setGameLists((prevLists) => ({
          ...prevLists,
          [sortType]: [...prevLists[sortType], ...newGames],
        }));
        setFlagIds((prevIds) => ({
          ...prevIds,
          [sortType]:
            newGames.length > 0
              ? newGames[newGames.length - 1].id
              : prevIds[sortType],
        }));
      })
      .catch((error) => {
        // 处理错误，例如打印错误信息
        console.error("Error fetching game list:", error);
      });
  };

  // 当用户滚动到底部时加载更多数据
  const handleEndReached = () => {
    getGameList(sortType);
  };
  // 游戏标签是一个id数组
  const gameTagIds = gameTagsHot;
  // 使用map函数遍历游戏标签id数组
  const gameTagNames = gameTagIds.map((tagId) => {
    // 在gameTags数组中找到对应的标签对象
    const tagObject = gameTags.find((tag) => tag.id === tagId);
    // 如果找到了对应的标签对象，返回其name，否则返回原始id
    return tagObject ? tagObject.name : tagId;
  });

  // 从数组中随机选择五个不重复的元素
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

  // 使用 getRandomTags 函数获取五个随机标签
  const randomTags = getRandomTags(gameTagNames, 5);
  const viewRef = useRef(null); // 创建一个引用
  return (
    <FlatList
      data={gameLists[sortType]}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          activeOpacity={0.5} // 设置点击时的透明度
          onPress={() => navigation.navigate("Game", { gameID: item.id })} // 点击后跳转到游戏详情页
        >
          <GameList game={item} osType={osType} ranking={index + 1} />
        </TouchableOpacity>
      )}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={
        <>
          <View style={[styles.containerList, { alignItems: "center" }]}>
            <Text>榜单切换</Text>
            <TouchableOpacity onPress={handleToggleModal}>
              <View
                ref={viewRef} // 将引用附加到元素上
                style={styles.dropdown}
              >
                <Text style={styles.dropdownText}>{selectedOption}</Text>
              </View>
              <Modal visible={modalVisible} transparent={true}>
                <TouchableWithoutFeedback onPress={handleToggleModal}>
                  <View style={{ width: "100%", height: "100%" }}>
                    <View
                      style={[
                        styles.modalContainer,
                        {
                          position: "absolute",
                          top: viewLayout.y + viewLayout.height + 5,
                          left: viewLayout.x,
                        },
                      ]}
                    >
                      <View style={styles.modalContent}>
                        {OPTIONS.map((option, index) => (
                          <TouchableWithoutFeedback
                            onPress={() =>
                              handleSelectOption(option, index + 1)
                            }
                            key={option}
                          >
                            <Text style={{ padding: 6 }}>{option}</Text>
                          </TouchableWithoutFeedback>
                        ))}
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </TouchableOpacity>
          </View>
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  containerList: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: wp("3%"),
    paddingRight: wp("3%"),
    // paddingBottom: 10,
    // paddingTop: 10,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: wp("5%"),
    paddingRight: wp("5%"),
    paddingBottom: 10,
    // padding: wp("2%"),
    paddingTop: 10,
    backgroundColor: "white",
  },
  dropdown: {
    width: wp("15%"),
    // height: wp("8%"),
    // flex:1,
    padding: 1,
    borderRadius: 10,
    backgroundColor: "#ededed",
    justifyContent: "center",
    alignItems: "center",
  },

  dropdownText: {
    width: wp("15%"),
    textAlign: "center",
    textAlignVertical: "center",
  },
  modalContainer: {
    width: wp("15%"),
    backgroundColor: "#ededed",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    // position: "absolute",
    right: "2%",
    // bottom: "55%",
    borderRadius: 10,
  },
  modalContent: {
    width: wp("23%"),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
