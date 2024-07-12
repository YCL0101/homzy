# 项目

## 安装依赖

```sh
yarn install
```
## 启动项目

```sh
npx expo start
```

1. **development**（开发环境）：
```sh
   eas build --platform android --profile development
```

2. **preview**（预览环境）：
```sh
   eas build --platform android --profile preview
```

3. **production**（生产环境）：
```sh
   eas build --platform android --profile production
```

这些命令会根据 `eas.json` 文件中的配置来构建相应的 Android 应用。



# 短信验证

## 腾讯云短信验证 API 密钥

- SecretId:AKIDBKTTPzVwVwQp1IWkq4AJMVUKxRhjW9Yq
- SecretKey:FLFxmaEg1CIICvy1z02sZ3MrLnV5Zrww
- TemplateID:2181893
- SmsSdkAppId:1400917162

# MongoDB 笔记

## 管理员账号

- 用户名：admin
- 密码：hzy123hzy
- 权限：userAdminAnyDatabase

## gamesDatabase 数据库

- 用户名：gamesAdmin
- 密码：abc123
- 权限：dbOwner
- 链接：mongodb://gamesAdmin:abc123@43.132.136.85:27017/gamesDatabase

- 上传 json 数据至集合:mongoimport --uri mongodb://gamesAdmin:abc123@43.132.136.85:27017/gamesDatabase --collection pc_games --file C:\Users\HS\Desktop\pc_games.json --jsonArray

## 常用命令

- `show dbs`：列出所有的数据库。
  示例：`show dbs`

- `use <database>`：切换到指定的数据库。如果数据库不存在，MongoDB 会创建它。
  示例：`use gamesDatabase`

- `show collections`：列出当前数据库中的所有集合。
  示例：`show collections`

- `db.<collection>.find()`：查询指定集合中的所有文档。
  示例：`db.games.find()`

- `db.<collection>.insert(<document>)`：在指定集合中插入一个新的文档。
  示例：`db.games.insert({ name: "Super Mario", platform: "Nintendo" })`

- `db.<collection>.update(<query>, <update>)`：更新符合查询条件的文档。
  示例：`db.games.update({ name: "Super Mario" }, { $set: { platform: "Nintendo Switch" } })`

- `db.<collection>.remove(<query>)`：删除符合查询条件的文档。
  示例：`db.games.remove({ name: "Super Mario" })`

- `db.createUser(<user>)`：创建一个新的用户。
  示例：`db.createUser({ user: "gamesAdmin", pwd: "abc123", roles: [{ role: "dbOwner", db: "gamesDatabase" }] })`

- `db.dropUser(<username>)`：删除一个用户。
  示例：`db.dropUser("gamesAdmin")`

注意：在以上命令中，`<database>`、`<collection>`、`<document>`、`<query>`、`<update>` 和 `<user>` 需要替换为你的实际值。

# 安装 apk 解析包时出现问题的解决记录

在尝试使用 `IntentLauncher.startActivityAsync` 安装 APK 时，如果使用 `flags: IntentLauncher.FLAG_GRANT_READ_URI_PERMISSION` 会报“解析包时出现问题”，但是将 `flags` 的值直接设置为 `1`（即 `Intent.FLAG_GRANT_READ_URI_PERMISSION` 的值）则可以正常安装。

### 代码示例

出现问题的代码：

```javascript
const contentUri = await FileSystem.getContentUriAsync(uri);
console.log("Content URI: ", contentUri);
// Android N 及以上版本使用 content:// URI 安装 APK
IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
  data: contentUri, // 使用 contentUri 替代 uri
  type: "application/vnd.android.package-archive",
  flags: IntentLauncher.FLAG_GRANT_READ_URI_PERMISSION, // 这里会导致问题
}).catch((e) => console.error(e));
```

### 解决问题的代码：

```javascript
const contentUri = await FileSystem.getContentUriAsync(uri);
console.log("Content URI: ", contentUri);
// Android N 及以上版本使用 content:// URI 安装 APK
IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
  data: contentUri, // 使用 contentUri 替代 uri
  type: "application/vnd.android.package-archive",
  flags: 1, // 直接使用 1 替代 IntentLauncher.FLAG_GRANT_READ_URI_PERMISSION
}).catch((e) => console.error(e));
```

### 原因分析：

这个问题可能是由于 IntentLauncher.FLAG_GRANT_READ_URI_PERMISSION 的值不正确或者在特定的 Android 版本上行为不一致导致的。直接使用 1 作为 flags 的值是一个有效的解决方案，因为它直接对应于 Intent.FLAG_GRANT_READ_URI_PERMISSION 的实际值，确保了正确的权限被授予，从而允许 APK 的安装。
