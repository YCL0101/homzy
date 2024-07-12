import React from "react";
import { AuthProvider } from "./contexts/AuthContext"; // 导入认证上下文提供者
import MyStack from "./navigation/StackNavigator";

// App组件是应用的主入口
export default function App() {
  return (
    // AuthProvider提供了全局的认证上下文
    <AuthProvider>
      <MyStack/>
    </AuthProvider>
  );
}
