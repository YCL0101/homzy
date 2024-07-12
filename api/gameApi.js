import config from "../config.js";
//游戏信息获取接口
async function getGameInfo(osType, token, flagId, reqCnt, sortType) {
  const url = config.SERVER_URL + "/getallgamebydropdown";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        flagId: flagId,
        reqCnt: reqCnt,
        sortType: sortType,
        osType: osType,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

//游戏标签接口、热门标签接口
async function getTagsByTagsIds() {
  const url = config.SERVER_URL + "/gettagslist";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        tagsIds: null,
      }, //tagsIds为空时获取所有标签
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
//获取推荐游戏列表
async function getRecommendGameList(token) {
  const url = config.SERVER_URL + "/user/getrecommendgame";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
//获取游戏详情
async function getGameDetail(token, gameID) {
  const url = config.SERVER_URL + "/getgamedetailinfo";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        gameID: gameID,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
//获取多个游戏详情
async function getdetailgames(gameIDs) {
  const url = config.SERVER_URL + "/getdetailgame";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameID: gameIDs,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
  }
}
//搜索 searchType  0游戏 1评测 2攻略 3联系人 4主页君  不传递该参数,获取列表页面数据       传递该参数是某一类型的数据
async function searchGame(token, osType, searchText, tagId) {
  const url = config.SERVER_URL + "/post/searchpost";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        searchType: 0,
        searchContent: searchText,
        tagId: tagId,
        osType: osType,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
//获取验证码
async function getVerificationCode(tel) {
  const url = config.SERVER_URL + "/sms/login";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tel: tel,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
//手机号登录
async function loginByTel(tel, code) {
  const url = config.SERVER_URL + "/sms/loginack";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tel: tel,
        code: code,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
//获取用户信息
async function getUserInfo(tel, token) {
  // console.log("getUserInfo", tel, token);
  const url = config.SERVER_URL + "/user/getmyprofile";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        isPhone: tel,
        token: token,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
//获取其他用户
async function getUserDetail(uid, token) {
  const url = config.SERVER_URL + "/contacts/getuserprofile";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        otherUid: uid,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
//更改个人信息
async function changeUserInfo(params) {
  // console.log("changeUserInfo", params.sex, params.token);
  const url = config.SERVER_URL + "/user/changemyprofile";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: params.token,
    },
    body: JSON.stringify({
      nickname: params.nickname,
      headimgbase64: params.headimgbase64,
      sex: params.sex,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.status !== 0) {
    throw new Error(`API error! status: ${data.status}`);
  }

  return data.data;
}
//手机号换绑短信
async function getBindTelCode(tel, token) {
  const url = config.SERVER_URL + "/sms/bindtel";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        tel: tel,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
//手机号换绑
async function changeTel(tel, code, token) {
  const url = config.SERVER_URL + "/sms/bindtelack";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        tel: tel,
        code: code,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
// 上传APK
async function uploadApk(formData, token, onProgress) {
  return new Promise((resolve, reject) => {
    const url = config.SERVER_URL + "/mobileuploadgame"; // 服务器地址
    const xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);

    xhr.setRequestHeader("token", token);

    // 监听上传进度事件
    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        onProgress(percentComplete); // 调用回调函数报告进度
      }
    };

    xhr.onload = function () {
      if (xhr.status === 200) {
        // 请求成功
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`HTTP error! status: ${xhr.status}`));
      }
    };

    xhr.onerror = function () {
      reject(new Error("Upload failed"));
    };

    xhr.send(formData);
  });
}
//下载量统计
async function downloadCount(gameID) {
  const url = config.SERVER_URL + "/user/downloadanduninstallgame";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameID: gameID,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
export {
  getGameInfo,
  getTagsByTagsIds,
  getRecommendGameList,
  getGameDetail,
  searchGame,
  getVerificationCode,
  loginByTel,
  getUserInfo,
  getUserDetail,
  changeUserInfo,
  changeTel,
  getBindTelCode,
  uploadApk,
  getdetailgames,
  downloadCount,
};
