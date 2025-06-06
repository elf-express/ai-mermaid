# Smart Mermaid: AI 驅動的文本轉 Mermaid 圖表工具

AI Mermaid 是一款利用人工智能技術，將您的文本描述智能轉換為 Mermaid 格式圖表代碼，並實時渲染成可視化圖表的 Web 應用。無論是流程圖、序列圖、甘特圖還是狀態圖，只需輸入文本，AI 即可為您生成相應的圖表。



## 核心優勢

* **簡化圖表繪製**：告別手動編寫 Mermaid 代碼的繁瑣，通過自然語言描述即可快速生成圖表。
* **提升效率**：將想法迅速轉化為可視化圖表，節省您在文檔撰寫和溝通演示上的時間。
* **智能輔助**：AI 自動分析文本，理解意圖，並選擇合適的圖表類型（或由您指定）。
* **靈活配置**：支持自定義 AI 服務配置，滿足不同用户的需求。

## 主要功能

###  核心功能

* **靈活的文本輸入**:
    * 直接在編輯器中手動輸入或粘貼文本。
    * 支持上傳文件（.txt, .md, .docx 格式）。
    * 最大支持 20,000 字數的輸入長度。

* **智能 AI 轉換**:
    * 集成先進 AI 模型分析文本內容。
    * 支持自動識別最佳圖表類型或由用户指定。
    * 精準生成符合 Mermaid 規範的圖表代碼。

## UI 伺服器介面佈局規範

本應用采用現代化的雙卡片佈局，以下是具體的佈局規範說明，幫助開發者理解和維護系統。

### 整體結構

* **外層容器**：固定高度 (`h-screen`) 且溢出隱藏 (`overflow-hidden`)，確保整體 UI 固定不會出現瀏覽器外層滾動條
* **頁面高度分配**：
  * 頭部 (Header)：自適應高度
  * 主內容區：`h-[calc(100vh-110px)]`，整體高度為視窗高度減去 110px
  * 底部 (Footer)：高度固定 30px

### 左右卡片佈局

* **螢幕間距**：
  * 左側卡片與左側螢幕間距：25px
  * 右側卡片與右側螢幕間距：25px
  * 頁面頂部和底部間距：20px
  
* **卡片寬度分配 (桌面視圖)**：
  * 左側卡片（對話區）：40%
  * 右側卡片（畫布區）：60%
  
* **卡片間距**：20px (`md:gap-x-[20px]`)

### 卡片內部細節

* **卡片外觀**：
  * 圓角：`rounded-xl`
  * 陰影：`shadow-sm`
  * 邊框：`border border-gray-200`
  * 背景色：`bg-white`
  
* **卡片內間距**：
  * 左右卡片均為 12px (`p-3`)
  
* **左側卡片內部結構**：
  * 對話記錄區：`flex-1 overflow-y-auto mb-2`，可滾動，底部間距 8px
  * 輸入區間距：頂部 4px (`mt-1`)，底部 0
  * 輸入框高度：最小高度 40px (`min-h-[40px]`)，自動擴展
  * 按鈕位置：位於輸入框內部右側，垂直居中

* **右側卡片內部結構**：
  * Excalidraw 畫布作為子元素幅度填滿整個卡片
  * 畫布區限制在卡片內的內間距 12px (`p-3`) 範圍內

### 響應式設計

* **手機視圖**：
  * 左右卡片垂直堆疊 (`flex-col`)
  * 各卡片佈滿整個寬度 (`w-full`)
  * 卡片間垂直間距 16px (`gap-y-4`)

* **桌面視圖** (md尺寸以上)：
  * 左右卡片水平佈局 (`md:flex-row`)
  * 左側卡片寬度 40% (`md:w-[40%]`)
  * 右側卡片寬度 60% (`md:w-[60%]`)

佈局確保了應用在各種設備上的良好使用體驗，同時保持美觀和功能性的平衡。

* **便捷的圖表展示與編輯**:
    * 清晰展示 AI 生成的 Mermaid 源代碼。
    * 集成 Excalidraw 進行圖表的可視化渲染。
    * 支持在 Excalidraw 畫布上對圖表進行二次編輯和導出（如 PNG, SVG）。

### 高級功能

* **自定義 AI 配置**:
    * 支持配置您自己的 AI 服務 API（OpenAI、Azure OpenAI、其他兼容服務）
    * 可自定義 API URL、API Key 和模型名稱
    * 配置自己的 AI 服務後享有無限使用權限

* **訪問權限管理**:
    * 內置訪問密碼功能，驗證通過後可享有無限使用權限
    * 支持多種使用模式：免費限量 → 密碼驗證 → 自定義配置

* **使用量統計**:
    * 實時顯示剩餘使用次數
    * 本地存儲使用記錄，按日重置

## 使用權限説明

AI Mermaid 提供二種使用模式：

### 密碼模式  
- **權限**: 輸入訪問密碼後享有無限使用
- **適用**: 經授權的用户
- **獲取方式**: 聯繫作者獲取訪問密碼

### 自定義配置模式
- **權限**: 無限制使用
- **適用**: 有自己 AI 服務的用户  
- **配置**: 在設置中填入您的 API 配置
- **優勢**: 完全自主控制，無依賴

## 使用方法

### 基礎使用流程

1.  **輸入描述文本**:
    * 在左側的文本區域直接輸入或粘貼您的圖表描述。
    * 或者點擊上傳按鈕，選擇本地的 `.txt`, `.md`, 或 `.docx` 文件。

2.  **選擇圖表類型**:
    * 從下拉菜單中選擇您期望生成的圖表類型（如流程圖、序列圖等）。
    * 您也可以選擇"自動選擇"，讓 AI 根據文本內容判斷最合適的圖表類型。

3.  **生成圖表**:
    * 點擊"生成圖表"按鈕。
    * AI 將開始處理您的文本，並在右側區域顯示生成的 Mermaid 代碼和 Excalidraw 渲染的圖表。

4.  **查看與編輯**:
    * 您可以直接在 Mermaid 代碼區域查看或修改代碼，圖表會實時更新。
    * Excalidraw 畫布支持對圖表元素進行拖拽、修改樣式等操作，並可導出圖表。

### 解鎖無限使用

#### 方法一：使用訪問密碼
1. 點擊右上角的設置按鈕
2. 在"訪問密碼"選項卡中輸入密碼
3. 驗證成功後即可享有無限使用權限

#### 方法二：配置自定義 AI 服務
1. 點擊右上角的設置按鈕
2. 在"AI 配置"選項卡中填入您的配置：
   - **API URL**: 您的 AI 服務地址（如：`https://api.openai.com/v1`）
   - **API Key**: 您的 API 密鑰
   - **模型名稱**: 使用的模型（如：`gpt-3.5-turbo`, `gpt-4`等）
3. 保存配置後即可無限使用

## 🚀 快速開始

### 使用 Docker 部署（推薦）

1. **複製環境變數範例**：
    AI_API_URL=https://api.openai.com/v1
    AI_API_KEY=在此處填入您的API密鑰
    AI_MODEL_NAME=gpt-3.5-turbo
    
    # 應用配置
    NEXT_PUBLIC_MAX_CHARS=20000
    NEXT_PUBLIC_DAILY_USAGE_LIMIT=5
    
    # 訪問密碼（可選）
    ACCESS_PASSWORD=設置您的訪問密碼
    ## 環境變數設置

1. 複製 `.env.example` 為 `.env`：
   ```bash
   cp .env.example .env
    ```

    **環境變量説明**:
    * `AI_API_URL`: AI 服務 API 的基礎地址（不包含 `/chat/completions`）
    * `AI_API_KEY`: 您的 AI 服務 API 密鑰
    * `AI_MODEL_NAME`: 指定使用的 AI 模型名稱
    * `NEXT_PUBLIC_MAX_CHARS`: 允許用户輸入的最大字數數（默認 20,000）
    * `NEXT_PUBLIC_DAILY_USAGE_LIMIT`: 每用户每日免費使用次數限制（默認 5）
    * `ACCESS_PASSWORD`: 可選，設置後用户可通過輸入此密碼獲得無限使用權限

4.  **啓動開發服務器**:
    ```bash
    npm run dev
    # 或者
    yarn dev
    ```

5.  **訪問應用**:
    在瀏覽器中打開 `http://localhost:3000` 即可訪問本地部署的應用。


### 本地佈署

1. **複製環境變數範例**：
    AI_API_URL=https://api.openai.com/v1
    AI_API_KEY=在此處填入您的API密鑰
    AI_MODEL_NAME=gpt-3.5-turbo
    
    # 應用配置
    NEXT_PUBLIC_MAX_CHARS=20000
    NEXT_PUBLIC_DAILY_USAGE_LIMIT=5
    
    # 訪問密碼（可選）
    ACCESS_PASSWORD=設置您的訪問密碼
    ## 環境變數設置

2. 複製 `.env.example` 為 `.env`：
   ```bash
   cp .env.example .env
    ```

    **環境變量説明**:
    * `AI_API_URL`: AI 服務 API 的基礎地址（不包含 `/chat/completions`）
    * `AI_API_KEY`: 您的 AI 服務 API 密鑰
    * `AI_MODEL_NAME`: 指定使用的 AI 模型名稱
    * `NEXT_PUBLIC_MAX_CHARS`: 允許用户輸入的最大字數數（默認 20,000）
    * `NEXT_PUBLIC_DAILY_USAGE_LIMIT`: 每用户每日免費使用次數限制（默認 5）
    * `ACCESS_PASSWORD`: 可選，設置後用户可通過輸入此密碼獲得無限使用權限

3.  **啓動開發服務器**:
    ```bash
    npm run dev
    # 或者
    yarn dev
    ```

4.  **訪問應用**:
    在瀏覽器中打開 `http://localhost:3000` 即可訪問本地部署的應用。

5. **佈署到生產環境**:

5.1 **清除快取並重新安裝依賴**:
    ```bash
    rm -rf .next
    rm -rf node_modules
    npm cache clean --force
    npm install
    npm run build
    ```

 5.2 **增加 Node.js 記憶體限制**:
    ```bash
    set NODE_OPTIONS=--max-old-space-size=4096
    npm run build
    ```

5.3 **使用 --debug 參數查看詳細日誌**:
    ```bash
    npm run build -- --debug
    ``` 

5.4 **佈署到生產環境**:
    ```bash
    npm run start
    ```

    