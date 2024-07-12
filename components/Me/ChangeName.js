import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ATextInput,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AuthContext } from "../../contexts/AuthContext";
import { changeUserInfo } from "../../api/gameApi";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
function ChangeName() {
  const navigation = useNavigation();
  const { token, userInfo, setUserInfo } = useContext(AuthContext);
  const [params, setParams] = useState({
    nickname: null,
    headimgbase64: null,
    sex: null,
    token: token,
  });
  const [inputValue, setInputValue] = useState(userInfo.nickname);

const ChangeName = useCallback(() => {
  // console.log(inputValue);
  setParams((prevParams) => ({
    ...prevParams,
    nickname: inputValue,
  }));
}, [inputValue, setParams]);

useLayoutEffect(() => {
  navigation.setOptions({
    headerTitle: () => (
      <View style={styles.header}>
        <TouchableOpacity onPress={() => ChangeName()}>
          <Text>保存</Text>
        </TouchableOpacity>
      </View>
    ),
  });
}, [ChangeName]);

  useEffect(() => {
    // console.log(params);
    if (!params.nickname) {
      return;
    }
    // console.log(2);
    const changeInfo = async () => {
      try {
        let response = await changeUserInfo(params);
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          nickname: response.nickname,
        }));
        navigation.goBack();
      } catch (error) {
        console.error("Error when changing user info:", error);
      }
    };

    changeInfo();
  }, [params]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>昵称</Text>
        <TextInput
          style={styles.text}
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
        />
      </View>
    </View>
  );
}
export default React.memo(ChangeName);
const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  container: {
    // padding: wp("5%"),
    alignItems: "center",
  },
  avatar: {
    width: wp("20%"),
    height: wp("20%"),
    borderRadius: wp("10%"),
    marginBottom: hp("5%"),
    marginTop: hp("5%"),
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: wp("5%"),
    marginBottom: 1,
    backgroundColor: "white",
  },
  label: {
    fontSize: hp("2%"),
  },
  text: {
    fontSize: hp("2%"),
  },
});
