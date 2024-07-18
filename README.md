# team-weather

展示網址：http://35.77.223.154:8000/

## 組員工作分配表

- **江芳如**：基礎專案建置、專案部署（github action, EC2 user data）
- **蔡尚峰**：Discord Webhook 串接、首頁協作版面調整
- **詹承廷**：webscoket 聊天室製作、首頁協作版面調整
- **陳哲明**：天氣 API 串接、台灣地圖製作、縣市詳細資料製作、首頁版面主要製作

## 如何建置專案

### 前提條件

- GitHub 帳號
- Git
- Python 3.7+
- pip (Python 套件管理器)

### 步驟

1. Fork 專案儲存庫：
   - 訪問 https://github.com/jiangMo09/team-weather/tree/develop
   - 點擊頁面右上角的 "Fork" 按鈕
   - 選擇你要 Fork 到的目標帳號（通常是你自己的帳號）

2. 複製你 Fork 的 reposotry：
   ```
   git clone https://github.com/your-username/team-weather.git
   cd team-weather
   ```

3. 設定上游遠端 repository：
   ```
   git remote add origin https://github.com/your-username/team-weather.git # 注意：此專案主要在 develop 分支上進行開發。
   ```

4. 創建並啟動虛擬環境：
   ```
   python -m venv .venv
   source .venv/bin/activate  # 在 Windows 上使用 .venv\Scripts\activate
   ```

5. 安裝所需的套件：
   ```
   pip install -r requirements.txt
   ```

6. 設定環境變數（目前不需要，因無人使用環境變數）：
   ```
   export WEATHER_API_KEY=your_api_key_here  # 在 Windows 上使用 set 而不是 export
   ```

7. 運行應用程式：
   ```
   uvicorn app:app --reload
   ```

8. 在瀏覽器中訪問 `http://localhost:8000` 查看應用程式。
