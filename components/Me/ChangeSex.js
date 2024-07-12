import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { changeUserInfo } from "../../api/gameApi";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Picker } from "@react-native-picker/picker";
function ChangeSex({ showsex, setShowsex }) {
  const { token, setUserInfo } = useContext(AuthContext);
  // const [modalVisible, setModalVisible] = useState(showsex);
  const [selectedGender, setSelectedGender] = useState();

  const handleConfirm = () => {
    // 在这里处理用户选择的性别

    handleUserChoice(Number(selectedGender));
  };
  const [params, setParams] = useState({
    sex: null,
    token: token,
  });

  const changeInfo = async () => {
    if (!params.sex) {
      return;
    }

    try {
      // console.log("params", params);
      let response = await changeUserInfo(params);
      // console.log("response", response);
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        sex: response.sex,
      }));
      setShowsex(false);
    } catch (error) {
      console.error("Error when changing user info:", error);
    }
  };

  useEffect(() => {
    if (params.sex) {
      changeInfo();
    }
  }, [params]);

  const handleUserChoice = (choice) => {
    setParams((prevParams) => ({
      ...prevParams,
      sex: choice,
    }));
  };

  return (
    <Modal animationType="slide" transparent={true} visible={showsex}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={() => setShowsex(false)}
      >
        <View style={styles.modal}>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => setShowsex(false)}>
              <Text>取消</Text>
            </TouchableOpacity>
            <Text style={styles.title}>选择性别</Text>
            <TouchableOpacity onPress={handleConfirm}>
              <Text>确定</Text>
            </TouchableOpacity>
          </View>

          <Picker
            selectedValue={selectedGender}
            onValueChange={(itemValue) => setSelectedGender(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="男" value="1" />
           
            <Picker.Item label="女" value="2" />
          </Picker>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default ChangeSex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    width: "80%",
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    textAlign: "center",
    // fontSize: 15,
    // marginVertical: 10,
  },
  picker: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },

});
