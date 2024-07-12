// 上传APK文件的组件
import React, { useState, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  ScrollView,
  ToastAndroid,
  Image, // 引入 Image 组件
  FlatList,
  Pressable,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as FileSystem from "expo-file-system";
// import { Blob } from 'react-native-fetch-blob';
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { uploadApk } from "../api/gameApi";
import { AuthContext } from "../contexts/AuthContext";
import { formatDiskSizeFromBytes } from "../utils/utils";

export default function UploadApk() {
  const { token, gameTags } = useContext(AuthContext); // 使用AuthContext
  const [shortDes, setShortDes] = useState(""); // 短描述状态
  const [bannerImg, setBannerImg] = useState(null); // 游戏横幅图像状态
  const [selectedTags, setSelectedTags] = useState([]); // 选中的标签状态
  const [apk, setApk] = useState(null); // APK文件状态
  const [isUploading, setIsUploading] = useState(false); // 新增状态
  const [searchText, setSearchText] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  // 选择APK文件的函数
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled && result.assets && result.assets.length === 1) {
      const selectedFile = result.assets[0];
      if (selectedFile.name.endsWith(".apk")) {
        // console.log("selectedFile", selectedFile);
        setApk(selectedFile);
        ToastAndroid.show("APK已缓存", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("选中的文件不是APK文件", ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show("文件选择失败", ToastAndroid.SHORT);
    }
  };

  // 修改后的选择游戏横幅图像的函数，添加了打印语句以记录选择过程
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      ToastAndroid.show("图片已选择", ToastAndroid.SHORT);
      // console.log(result.assets[0]);
      setBannerImg(result.assets[0]);
    } else {
      ToastAndroid.show("图片选择已取消或未选择图片。", ToastAndroid.SHORT);
    }
  };

  // 切换选中标签的函数
  const toggleTag = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else if (selectedTags.length < 4) {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  // 上传文件和表单数据的函数
  async function uploadFile() {
    // 检查各字段是否为空
    if (!apk) {
      ToastAndroid.show("请选择APK文件", ToastAndroid.SHORT);
      setIsUploading(false);
      return;
    }
    if (!bannerImg) {
      ToastAndroid.show("请选择游戏展示图", ToastAndroid.SHORT);
      setIsUploading(false);
      return;
    }
    if (shortDes.trim().length === 0) {
      ToastAndroid.show("游戏描述不能为空", ToastAndroid.SHORT);
      setIsUploading(false);
      return;
    }
    if (selectedTags.length === 0) {
      ToastAndroid.show("至少选择一个标签", ToastAndroid.SHORT);
      setIsUploading(false);
      return;
    }

    setIsUploading(true); // 开始上传前设置为true
    // 创建 FormData 对象
    let formData = new FormData();

    // 添加 APK 文件
    formData.append("apk", {
      uri: apk.uri,
      type: apk.mimeType,
      name: apk.name,
    });
    // 添加横幅图像
    const bannerImgBase64 = await FileSystem.readAsStringAsync(bannerImg.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    formData.append(
      "bannerImg",
      `data:${bannerImg.mimeType};base64,${bannerImgBase64}`
    );
    // 添加其他表单数据
    formData.append("shortDes", shortDes);
    formData.append("tags", JSON.stringify(selectedTags.map(Number)));

    // 上传
    uploadApk(formData, token, (progress) => {
      const progressRounded = progress.toFixed(2);
      setUploadProgress(progressRounded);
      // console.log(`Upload progress: ${progressRounded}%`); // 使用保留两位小数的进度
    })
      .then((data) => {
        console.log("Upload success:", data);
        if (data?.status === 0) {
          ToastAndroid.show("上传成功", ToastAndroid.SHORT);
          setIsUploading(false);
        } else {
          ToastAndroid.show(data?.data, ToastAndroid.SHORT);
          setIsUploading(false);
        }
      })
      .catch((error) => {
        console.error("Upload failed:", error);
        ToastAndroid.show("上传失败", ToastAndroid.SHORT);
      })
      .finally(() => {
        setIsUploading(false); // 无论成功还是失败，上传结束后设置为false
      });
  }
  const filterTags = () => {
    if (!searchText.trim()) return []; // 当搜索框为空时，返回空数组
    return gameTags.filter((tag) =>
      tag.name.toLowerCase().includes(searchText.toLowerCase())
    );
  };
  const CancelTag = (tagId) => {
    setSelectedTags(selectedTags.filter((id) => id !== tagId));
  };
  const hints = [
    "上传应用前，请先在社区搜索确认无相同版本应用，以避免上传失败。",
    "请仅上传您有权分享的应用程序，避免侵犯他人的知识产权。",
    "在上传前，请确保应用程序未感染病毒或恶意软件，以保障其他用户的设备安全。",
    "请勿上传或分享含有色情、暴力、仇恨言论或其他违法内容的应用。",
    "请避免上传欺诈性应用程序，如虚假广告、诈骗软件等，以维护社区的诚信。",
  ];
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.chooseContainer}>
          <Text style={{ fontWeight: "bold" }}>填写信息</Text>
          <View>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setShortDes(text.substring(0, 200))}
              value={shortDes}
              placeholder="应用描述(200字以内)"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        <View style={styles.chooseContainer}>
          <View>
            <Text style={{ fontWeight: "bold" }}>选择应用截图</Text>
          </View>
          <View style={styles.Select_Image}>
            {bannerImg && (
              <Image
                source={{ uri: bannerImg.uri }}
                style={styles.imagePreview}
              />
            )}
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={require("../assets/Images/icon/ico_edit_add.png")}
                style={styles.imagePreview}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.chooseContainer}>
          <Text style={{ fontWeight: "bold" }}>选择标签(限4个)</Text>
          <View style={styles.selectedTagsContainer}>
            <Text>已选择：</Text>
            {selectedTags.map((tagId) => {
              const tag = gameTags.find((tag) => tag.id === tagId);
              return (
                <View key={tagId} style={styles.tag}>
                  <Pressable
                    onPress={() => CancelTag(tagId)}
                    style={styles.pressable}
                  >
                    <Text style={styles.tagText}>{tag.name}</Text>
                    {/* <Text style={styles.closeIcon}>✖</Text> */}
                  </Pressable>
                </View>
              );
            })}
          </View>

          <TextInput
            style={styles.inputTag}
            onChangeText={(text) => setSearchText(text)}
            value={searchText}
            placeholder="搜索标签"
          />
          <View style={styles.tagsContainer}>
            {filterTags().map((tag) => (
              <TouchableOpacity
                key={tag.id}
                style={[
                  styles.tag,
                  selectedTags.includes(tag.id) && styles.selectedTag,
                ]}
                onPress={() => toggleTag(tag.id)}
              >
                <Text style={styles.tagText}>{tag.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.chooseContainer}>
          <Text style={{ fontWeight: "bold" }}>选择APK</Text>
          <View style={{width:50}}>
            <TouchableOpacity onPress={pickDocument}>
              <Image
                source={require("../assets/Images/icon/ico_edit_add.png")}
                style={styles.imagePreview}
              />
            </TouchableOpacity>
          </View>

          {apk && (
            <View style={styles.apkInfoContainer}>
              <Text style={styles.apkInfoText}>文件名: {apk.name}</Text>
              <Text style={styles.apkInfoText}>
                大小: {formatDiskSizeFromBytes(apk.size)}
              </Text>
            </View>
          )}
        </View>

        <View style={{ width: "90%" }}>
          <Button
            title={
              uploadProgress === 0 || uploadProgress >= 100
                ? "上传文件"
                : `${uploadProgress}%`
            }
            onPress={uploadFile}
            disabled={isUploading} // 根据isUploading禁用按钮
          />
        </View>
        <View style={styles.hintContainer}>
          <Text style={styles.hint}>提示:</Text>
          {hints.map((hint, index) => (
            <Text key={index} style={styles.hint}>
              {index + 1}. {hint}
            </Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "center",
    // margin: 10,
    paddingBottom: 20,
  },
  input: {
    width: wp("90%"),
    borderWidth: 1,
    padding: 2,
    // width: "100%",
    textAlignVertical: "top",
    // margin: 10,
  },
  inputTag: {
    width: wp("90%"),
    borderWidth: 1,
    padding: 2,
    paddingLeft: 5,
  },
  button: {
    width: "90%",
    margin: 10,
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 20,
    // textAlign: "center",
    alignItems: "center",
    // justifyContent: "center",
  },
  chooseContainer: {
    width: "90%",
    marginTop: 10,
  },
  Select_Image: {
    flexDirection: "row",
  },
  imagePreview: {
    width: 50,
    height: 50, // 设置预览图像的高度
    resizeMode: "contain", // 保证图像完整显示
    marginVertical: 10, // 在图像上下添加一些间距
    marginRight: 10,
  },
  tagsContainer: {
    width: "90%",
    marginTop: 10,
    alignItems: "flex-start",
    flexWrap: "wrap",
    flexDirection: "row",
  },
  tagRow: {
    flexDirection: "row",
    justifyContent: "space-around", // 保证标签在行中均匀分布
    width: "100%", // 确保每行宽度充满容器
    alignItems: "center", // 添加此行来实现上下对齐
  },
  tag: {
    margin: 1,
    marginHorizontal: "auto", // 调整水平边距以居中每个标签
    margin: 5,
    padding: 5,
    backgroundColor: "#ddd",
    borderRadius: 10,
    // 确保标签宽度一致，可以设置一个固定的宽度或最小宽度
    minWidth: 50,
    textAlign: "center", // 确保文本在标签内居中
    position: "relative",
  },
  pressable: {
    // 按压组件样式，根据需要调整
  },
  tagText: {
    // 标签文本样式，根据需要调整
  },
  closeIcon: {
    position: "absolute", // 使用绝对定位
    fontSize: 7,
    fontWeight: "bold",
    right: -5, // 从右边开始
    top: 5, // 从顶部开始
    padding: 4, // 添加一些内边距以便于点击
    // 可能还需要调整字体大小或颜色
  },
  tagText: {
    fontSize: 10,
    textAlign: "center",
  },
  selectedTag: {
    backgroundColor: "#aaa",
  },
  selectedTagsContainer: {
    flexDirection: "row",
    // flexWrap: "wrap",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  apkInfoContainer: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    width: "90%",
  },
  apkInfoText: {
    fontSize: 14,
    marginVertical: 2,
  },
  hintContainer: {
    width: "100%",
    alignItems: "center",
  },
  hint: {
    width: "90%",
    fontSize: 12,
    color: "#666",
    marginTop: 10,
  },
});
