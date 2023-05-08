# slg游戏客户端demo 使用CocosCreator3.4.0 开发
## 素材来源于网络，仅供学习使用，请勿用于商业用途
## 服务端demo：https://github.com/llr104/slgserver
**鄙视b站、抖音 up主码神之路，从这里拿demo讲课也不说出处，忽悠小白是自己写的**

**代码交流群：1054084192**

## 连接服务端

服务端部署成功后，修改客户端 GameConfig.ts 文件中的连接地址

```typescript
import { _decorator } from 'cc';
const GameConfig = {
    serverUrl: "ws://127.0.0.1:8004", //httpserver 地址
    webUrl: "http://127.0.0.1:8088",  //gateserver 地址
}
export { GameConfig };
```

## 客户端截图

### 队伍征兵
![队伍征兵](https://s1.imagehub.cc/images/2023/05/08/01.png)

### 占领领地
![占领领地](https://s1.imagehub.cc/images/2023/05/08/02.png)

### 出征返回
![出征返回](https://s1.imagehub.cc/images/2023/05/08/03.png)

### 城内设施
![城内设施](https://s1.imagehub.cc/images/2023/05/08/10.png)

### 武将
![武将](https://s1.imagehub.cc/images/2023/05/08/11a2c81d5956c6dee0.png)

### 武将详情
![武将详情](https://s1.imagehub.cc/images/2023/05/08/12.png)

### 友方主城
![友方主城](https://s1.imagehub.cc/images/2023/05/08/04.png)

### 敌方主城
![敌方主城](https://s1.imagehub.cc/images/2023/05/08/05.png)

### 军队前往敌方主城
![军队前往敌方主城](https://s1.imagehub.cc/images/2023/05/08/06.png)

### 抽卡结果
![抽卡结果](https://s1.imagehub.cc/images/2023/05/08/07.png)

### 战报
![战报](https://s1.imagehub.cc/images/2023/05/08/13.png)

### 技能
![技能](https://s1.imagehub.cc/images/2023/05/08/08.png)

### 联盟
![联盟](https://s1.imagehub.cc/images/2023/05/08/09.png)

### 聊天
![聊天](https://s1.imagehub.cc/images/2023/05/08/14.png)


