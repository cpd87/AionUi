# AionUi 桌面宠物 — 独立窗口方案

## 1. 目标

将桌面宠物从页面内 `fixed div` 升级为 **独立透明 Electron 窗口**，浮在桌面所有窗口上方，随 AionUi 启动，不依赖 AionUi 主窗口可见性。

参考：[clawd-on-desk](https://github.com/rullerzhou-afk/clawd-on-desk)（MIT License）

---

## 2. 架构设计

### 2.1 窗口架构

```
┌─────────────────────────────────────────┐
│  AionUi 主窗口（Renderer Process）       │
│  - 对话界面                              │
│  - SendBox 发送消息                      │
│  - 监听 AI 事件 → IPC 发到主进程         │
└──────────────┬──────────────────────────┘
               │ IPC: pet.state
               ▼
┌─────────────────────────────────────────┐
│  Main Process（主进程）                   │
│  - PetWindowManager                      │
│  - 管理宠物窗口生命周期                   │
│  - 转发事件到宠物窗口                     │
│  - 监听空闲/鼠标活动                     │
└──────────────┬──────────────────────────┘
               │ IPC: pet.update
               ▼
┌─────────────────────────────────────────┐
│  Pet BrowserWindow（独立窗口）            │
│  - frameless + transparent              │
│  - alwaysOnTop + skipTaskbar            │
│  - 渲染 SVG 动画                        │
│  - 处理拖拽/点击/右键菜单                │
│  - 眼睛追踪鼠标                         │
└─────────────────────────────────────────┘
```

### 2.2 宠物窗口配置

```typescript
// src/process/pet/PetWindowManager.ts
petWindow = new BrowserWindow({
  width: 160,
  height: 160,
  frame: false,           // 无边框
  transparent: true,      // 透明背景
  alwaysOnTop: true,      // 始终在最前
  skipTaskbar: true,      // 不在任务栏显示
  resizable: false,
  hasShadow: false,
  focusable: false,       // 不抢焦点
  webPreferences: {
    preload: petPreloadPath,
  },
});

// macOS 特殊处理：在全屏应用上方也可见
if (process.platform === 'darwin') {
  petWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  petWindow.setAlwaysOnTop(true, 'screen-saver');
}

// Windows 特殊处理：在任务栏上方
if (process.platform === 'win32') {
  petWindow.setAlwaysOnTop(true, 'pop-up-menu');
}
```

### 2.3 文件结构

```
src/process/pet/                     # 主进程
├── PetWindowManager.ts              # 窗口管理（创建、销毁、位置记忆）
├── PetStateRouter.ts                # 事件路由（AI 事件 → 宠物状态）
└── PetIdleDetector.ts               # 空闲检测（鼠标不动 → 睡眠序列）

src/renderer/pet/                    # 宠物窗口的渲染进程
├── pet.html                         # 宠物窗口入口 HTML
├── PetApp.tsx                       # 宠物渲染根组件
├── PetInteraction.ts                # 拖拽、点击、右键菜单逻辑
├── PetEyeTracker.ts                 # 眼睛追踪鼠标
└── states/                          # 复用现有 SVG 组件
    ├── IdlePet.tsx
    ├── ThinkingPet.tsx
    ├── WorkingPet.tsx
    └── ... (11 个状态)

src/preload/petPreload.ts            # 宠物窗口的 preload 脚本
```

### 2.4 删除/替换

现有的页面内宠物方案将被移除：

```
删除:
  src/renderer/components/layout/DesktopPet/   # 页面内组件全部删除
  Layout.tsx 中的 <PetWidget /> 引用

保留:
  docs/feature/desktop-pet/                    # 设计资产预览文件
  src/renderer/utils/emitter.ts 中的 pet.state 事件
  各 SendBox 中的 emitter.emit('pet.state') 调用
```

---

## 3. AionUi 已有事件 & 宠物状态映射

### 3.1 当前可用的事件源

AionUi 各平台 SendBox 已有的事件（以 OpenClawSendBox 为例）：

| 事件源 | 代码位置 | 当前行为 |
|--------|---------|---------|
| `message.type === 'thought'` | SendBox switch 分支 | 显示思考流 |
| `message.type === 'content'` | SendBox switch 分支 | 添加消息内容 |
| `message.type === 'finish'` | SendBox switch 分支 | 重置 aiProcessing |
| `message.type === 'agent_status'` | SendBox switch 分支 | 显示代理状态 |
| `message.type === 'acp_permission'` | SendBox switch 分支 | 权限确认 |
| `setAiProcessing(true)` | 发送消息时 | 开始加载 |
| `setAiProcessing(false)` | 收到 finish 时 | 结束加载 |
| `conversation.turnCompleted` | IPC emitter | 轮次完成 |
| `conversation.stop` | IPC 方法 | 用户停止 |

### 3.2 推荐的事件 → 宠物状态映射

```typescript
// src/process/pet/PetStateRouter.ts

const EVENT_TO_PET_STATE = {
  // ── AI 对话事件 ──
  'user.prompt.submit':     'thinking',    // 用户发送消息 → 思考中
  'ai.thought':             'thinking',    // 收到 thought 流 → 思考中
  'ai.content.start':       'working',     // 首次收到 content → 工作中
  'ai.tool.call':           'working',     // 工具调用 → 工作中
  'ai.tool.fail':           'error',       // 工具调用失败 → 报错
  'ai.finish':              'happy',       // 回复完成 → 开心
  'ai.error':               'error',       // AI 出错 → 报错
  'ai.stop':                'notification',// 用户主动停止 → 提醒

  // ── 会话生命周期 ──
  'conversation.create':    'waking',      // 新建会话 → 醒来
  'conversation.switch':    'idle',        // 切换会话 → 待机
  'session.end':            'sleeping',    // 关闭所有会话 → 睡觉

  // ── 系统事件（建议新增） ──
  'context.compact':        'sweeping',    // 上下文压缩 → 扫地
  'agent.subagent.start':   'juggling',    // 子代理启动 → 杂耍
  'agent.subagent.stop':    'working',     // 子代理完成 → 回到工作

  // ── 空闲检测（主进程定时器） ──
  'idle.20s':               'sleeping',    // 20秒无操作 → 打盹
  'idle.60s':               'sleeping',    // 60秒无操作 → 深度睡眠
  'mouse.move.after.sleep': 'waking',      // 鼠标移动唤醒 → 伸懒腰
};
```

### 3.3 实现方式

**Renderer → Main Process（事件上报）：**

各 SendBox 已有 `emitter.emit('pet.state', ...)` 调用。改为通过 IPC 桥发到主进程：

```typescript
// 在各 SendBox 的 message handler 中，补充更细粒度的事件：

case 'thought':
  ipcBridge.pet.setState.invoke('thinking');
  break;

case 'content':
  if (!hasContentInTurnRef.current) {
    ipcBridge.pet.setState.invoke('working');
  }
  break;

case 'finish':
  ipcBridge.pet.setState.invoke('happy');
  break;

// 发送消息时：
ipcBridge.pet.setState.invoke('thinking');
```

**Main Process → Pet Window（状态转发）：**

```typescript
// PetWindowManager.ts
ipcMain.handle('pet:setState', (_, state) => {
  if (petWindow && !petWindow.isDestroyed()) {
    petWindow.webContents.send('pet:update', state);
  }
});
```

---

## 4. 交互行为规格

### 4.1 拖拽

| 参数 | 值 | 说明 |
|------|-----|------|
| 拖拽阈值 | 3px | 小于 3px 位移视为点击 |
| 拖拽中动画 | 切换到 `dragging` 状态 | 被拉扯的惊讶表情 |
| 松手回弹 | 150ms ease-out | 回到正常表情 |
| 位置记忆 | 保存到 `userData/pet-prefs.json` | 重启恢复上次位置 |
| 边界限制 | 不允许拖出屏幕 | 贴边吸附 |

### 4.2 点击反应

| 交互 | 反应 | 持续时间 |
|------|------|---------|
| 单击（idle 时） | happy 跳跃 | 4s |
| 双击（400ms 内） | 方向感知偏头（点左半→左偏，点右半→右偏） | 2.5s |
| 3+ 连点 | error 抖动（恼怒） | 3.5s |
| 非 idle 状态点击 | 无反应 | — |

### 4.3 睡眠序列

```
鼠标活跃 → idle（正常呼吸）
    ↓ 20s 无操作
随机 idle 动画（look/read，6-14s）
    ↓ 60s 无操作
yawning 打哈欠（3s）
    ↓ 自动过渡
sleeping 睡觉（zzz 飘浮）
    ↓ 鼠标移动
waking 伸懒腰（5s）→ idle
```

### 4.4 状态优先级

```
error(8) > notification(7) > sweeping(6) > happy(5)
> juggling/building(4) > working(3) > thinking(2)
> waking(2) > idle(1) > sleeping(0)
```

高优先级状态可以打断低优先级。每个状态有最短显示时间，未播完时新状态排队等待。

### 4.5 眼睛追踪

| 参数 | 值 |
|------|-----|
| 轮询频率 | 60fps（requestAnimationFrame） |
| 眼球最大偏移 | 3px |
| 距离衰减 | 300px 范围内线性衰减 |
| 身体跟随 | 眼球偏移的 33% |
| 阴影跟随 | 倾斜方向拉伸 15% |
| 生效状态 | 仅 idle |

### 4.6 右键菜单

```
┌─────────────────────┐
│ 🔍 大小              │
│   ├ 小 (80px)        │
│   ├ 中 (120px) ✓     │
│   └ 大 (160px)       │
├─────────────────────┤
│ 😴 勿扰模式          │
│ 👋 隐藏宠物          │
├─────────────────────┤
│ ℹ️  关于 AionUi Pet  │
└─────────────────────┘
```

---

## 5. 动画资产清单

### 5.1 已有（11 个）

| 状态 | 文件 | 说明 |
|------|------|------|
| idle | IdlePet.tsx | 呼吸+眨眼+微摆 |
| thinking | ThinkingPet.tsx | 侧脸嘟嘴+气泡+光点 |
| working | WorkingPet.tsx | 正面+笔记本+打字 |
| happy | HappyPet.tsx | 跳跃+^^眼+星光 |
| sleeping | SleepingPet.tsx | 深呼吸+zzz飘浮 |
| error | ErrorPet.tsx | 抖动+X眼+帽子飞 |
| notification | NotificationPet.tsx | 惊跳+叹号弹出 |
| waking | WakingPet.tsx | 伸懒腰+双手举+星星爆 |
| sweeping | SweepingPet.tsx | 扫帚+左右摇摆+尘土 |
| building | BuildingPet.tsx | 积木+齿轮旋转+弹跳 |
| juggling | JugglingPet.tsx | 三球抛物线+大笑 |

### 5.2 需要新增（5 个）

| 状态 | 用途 | 动画描述 |
|------|------|---------|
| dragging | 被拖拽时 | 惊讶表情，身体被拉伸，帽子快掉 |
| yawning | 睡前过渡 | 嘴巴张大打哈欠，眼睛眯起 |
| dozing | 半睡半醒 | 头一点一点，比 sleeping 轻 |
| poke-left | 被左侧点击 | 头歪向右看你 |
| poke-right | 被右侧点击 | 头歪向左看你 |

### 5.3 可选新增

| 状态 | 用途 | 动画描述 |
|------|------|---------|
| attention | AI 回复完成的小庆祝 | 比 happy 温和，点头微笑 |
| carrying | 创建 worktree/搬运任务 | 抱着箱子走路 |
| random-look | idle 随机行为 | 左右张望 |
| random-read | idle 随机行为 | 低头看书 |

---

## 6. 实施计划

### Phase 1 — 独立窗口基础（1-2 天）

- [ ] 创建 `PetWindowManager.ts`（主进程，管理宠物窗口生命周期）
- [ ] 创建 `pet.html` + `PetApp.tsx`（宠物窗口渲染）
- [ ] 创建 `petPreload.ts`（IPC 桥接）
- [ ] 将 SVG 状态组件迁移到宠物窗口
- [ ] 删除页面内 PetWidget，改为 IPC 事件上报
- [ ] 基础拖拽 + 位置记忆

### Phase 2 — 交互完善（1-2 天）

- [ ] 点击反应（单击/双击/连点）
- [ ] 睡眠序列（20s→yawning→sleeping, 鼠标唤醒）
- [ ] 状态优先级队列
- [ ] 右键菜单（大小/隐藏/勿扰）
- [ ] 眼睛追踪鼠标

### Phase 3 — AI 事件联动（1 天）

- [ ] 各 SendBox 补充细粒度事件上报（thought/content/finish/error）
- [ ] PetStateRouter 事件映射
- [ ] 空闲检测（PetIdleDetector）

### Phase 4 — 动画补齐（1-2 天）

- [ ] 新增 dragging / yawning / dozing / poke-left / poke-right SVG
- [ ] 随机 idle 行为
- [ ] 设置面板（显示/隐藏/大小/勿扰模式开关）

### Phase 5 — 平台适配 & 打磨（1 天）

- [ ] macOS：visibleOnAllWorkspaces, fullScreen 兼容
- [ ] Windows：pop-up-menu 层级, HWND 恢复 watchdog
- [ ] Linux：toolbar 窗口类型, skipTaskbar 重设
- [ ] 设置持久化（开关、大小、位置、勿扰状态）

---

## 7. 注意事项

1. **仅 Electron 桌面端**：PWA/Web 端无法创建独立窗口，这些环境下不显示宠物
2. **性能**：宠物窗口独立渲染，不影响主窗口性能；空闲时降低刷新率
3. **CSS 动画 vs JS 动画**：SVG 内的 CSS `@keyframes` 在透明窗口中正常工作，无需改用 JS
4. **穿透点击**：透明区域自动穿透（Electron transparent window 默认行为），只有 SVG 内容区域响应鼠标
5. **多显示器**：拖拽支持跨显示器，位置记忆包含显示器标识
