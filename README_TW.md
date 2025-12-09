# @carllee1983/ecpay-fulllogistics

[English](README.md) | [繁體中文](README_TW.md)

[![npm version](https://img.shields.io/npm/v/@carllee1983/ecpay-fulllogistics.svg)](https://www.npmjs.com/package/@carllee1983/ecpay-fulllogistics)
[![CI](https://github.com/CarlLee1983/ecpay-fulllogistics-node/actions/workflows/ci.yml/badge.svg)](https://github.com/CarlLee1983/ecpay-fulllogistics-node/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.x-orange.svg)](https://bun.sh/)

> 綠界全方位物流 SDK Node.js 版本 (非官方)，支援 TypeScript 與 Bun。

## ✨ 特色

- 🚀 **完整支援 TypeScript** - 嚴格模式類型安全
- 📦 **雙模組支援** - 同時支援 ESM 與 CJS
- 🧪 **95%+ 測試覆蓋率** - 經過嚴格測試，可用於正式環境
- ⚡ **Bun 優化** - 使用 Bun 開發與測試，提供最佳效能
- 🔒 **AES-128-CBC 加密** - 內建與綠界 API 相容的加解密服務
- 📋 **JSON 格式 API** - 使用綠界新版 JSON + AES 加密格式

## 📦 安裝

```bash
# npm
npm install @carllee1983/ecpay-fulllogistics

# yarn
yarn add @carllee1983/ecpay-fulllogistics

# pnpm
pnpm add @carllee1983/ecpay-fulllogistics

# bun
bun add @carllee1983/ecpay-fulllogistics
```

## 🚀 快速開始

### 基本設定

```typescript
import {
  ApiMode,
  getApiUrl,
  validateConfig,
  type EcPayConfig,
} from '@carllee1983/ecpay-fulllogistics'

// 使用測試環境憑證
const config: EcPayConfig = {
  merchantId: '2000132',
  hashKey: '5294y06JbISpM5x9',
  hashIv: 'v77hoKGq4kWxNNIS',
  mode: ApiMode.Staging,
}

// 使用前先驗證設定
if (validateConfig(config)) {
  console.log('✅ 設定驗證成功')
  console.log('📍 API 網址:', getApiUrl(config.mode))
  // 輸出: https://logistics-stage.ecpay.com.tw
}
```

## 📖 使用範例

### 1. AES 加解密

`CipherService` 處理與綠界規格相容的 AES-128-CBC 加解密：

```typescript
import { CipherService } from '@carllee1983/ecpay-fulllogistics'

// 使用 16 字元的金鑰初始化
const cipher = new CipherService('5294y06JbISpM5x9', 'v77hoKGq4kWxNNIS')

// 加密資料 (會自動先進行 URL 編碼)
const plaintext = '{"MerchantTradeNo":"ORDER123","GoodsAmount":1000}'
const encrypted = cipher.encrypt(plaintext)
console.log('加密後:', encrypted)
// 輸出: Base64 編碼字串

// 解密資料 (會自動進行 URL 解碼)
const decrypted = cipher.decrypt(encrypted)
console.log('解密後:', decrypted)
// 輸出: {"MerchantTradeNo":"ORDER123","GoodsAmount":1000}
```

### 2. 建立 API 請求資料

`PayloadEncoder` 建立符合格式的請求資料：

```typescript
import { PayloadEncoder } from '@carllee1983/ecpay-fulllogistics'

const encoder = new PayloadEncoder('5294y06JbISpM5x9', 'v77hoKGq4kWxNNIS')

// 建立加密後的 API 請求資料
const payload = encoder.encode('2000132', {
  MerchantTradeNo: 'ORDER_' + Date.now(),
  LogisticsType: 'CVS',
  LogisticsSubType: 'UNIMART',
  GoodsAmount: 1000,
  GoodsName: '測試商品',
  SenderName: '寄件人',
  SenderCellPhone: '0912345678',
  ReceiverName: '收件人',
  ReceiverCellPhone: '0987654321',
  ReceiverStoreID: '991182',
  ServerReplyURL: 'https://your-domain.com/callback',
})

console.log('請求資料:', JSON.stringify(payload, null, 2))
// 輸出:
// {
//   "MerchantID": "2000132",
//   "RqHeader": {
//     "Timestamp": 1733749200,
//     "Revision": "1.0.0"
//   },
//   "Data": "encrypted_base64_string..."
// }

// 發送至綠界 API
const response = await fetch('https://logistics-stage.ecpay.com.tw/Express/v2/CreateOrder', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})
```

### 3. 解析 API 回應

`Response` 類別提供便利的方法處理綠界回應：

```typescript
import { PayloadEncoder, Response } from '@carllee1983/ecpay-fulllogistics'

const encoder = new PayloadEncoder('5294y06JbISpM5x9', 'v77hoKGq4kWxNNIS')

// 模擬綠界 API 回應
const apiResponse = {
  TransCode: 1,
  TransMsg: 'Success',
  Data: 'encrypted_response_string...',
}

// 建立 Response 包裝器並自動解密
const response = new Response(apiResponse, encoder)

// 檢查是否成功
if (response.isSuccess()) {
  // 使用便利方法取得常用欄位
  console.log('物流編號:', response.getAllPayLogisticsID())
  console.log('廠商交易編號:', response.getMerchantTradeNo())
  console.log('物流狀態:', response.getLogisticsStatus())
  console.log('托運單號:', response.getShipmentNo())
  console.log('驗證碼:', response.getCVSValidationNo())
  console.log('列印網址:', response.getPrintUrl())
  console.log('收件門市代號:', response.getReceiverStoreID())
  console.log('收件門市名稱:', response.getReceiverStoreName())

  // 或取得特定欄位
  const goodsAmount = response.get('GoodsAmount')
  console.log('商品金額:', goodsAmount)

  // 或取得完整資料物件
  const fullData = response.getData()
  console.log('完整回應:', fullData)
} else {
  console.error('API 錯誤:', response.getRtnCode(), response.getRtnMsg())
}
```

### 4. 處理未加密的回應

某些 API 回應可能不需要解密：

```typescript
import { Response } from '@carllee1983/ecpay-fulllogistics'

// Data 為未加密物件的回應
const errorResponse = {
  TransCode: 0,
  TransMsg: 'Parameter Error',
  Data: {
    RtnCode: 10100001,
    RtnMsg: 'MerchantTradeNo is required',
  },
}

// 建立 Response 時不需傳入 encoder
const response = new Response(errorResponse)

if (!response.isSuccess()) {
  console.error('錯誤代碼:', response.getRtnCode())
  console.error('錯誤訊息:', response.getRtnMsg())
}
```

### 5. 使用 LogisticsException 錯誤處理

使用 `LogisticsException` 進行一致的錯誤處理：

```typescript
import { LogisticsException } from '@carllee1983/ecpay-fulllogistics'

function validateOrder(data: {
  merchantTradeNo?: string
  goodsAmount?: number
  senderName?: string
}) {
  // 必填欄位驗證
  if (!data.merchantTradeNo) {
    throw LogisticsException.required('MerchantTradeNo')
    // 錯誤訊息: "MerchantTradeNo 為必填欄位。"
  }

  // 長度驗證
  if (data.merchantTradeNo.length > 20) {
    throw LogisticsException.tooLong('MerchantTradeNo', 20)
    // 錯誤訊息: "MerchantTradeNo 不可超過 20 個字元。"
  }

  // 格式驗證
  if (!/^[A-Za-z0-9]+$/.test(data.merchantTradeNo)) {
    throw LogisticsException.invalid('MerchantTradeNo', '只能包含英數字')
    // 錯誤訊息: "MerchantTradeNo 格式無效：只能包含英數字"
  }

  // 範圍驗證
  const validAmounts = [60, 90, 120]
  if (data.goodsAmount && !validAmounts.includes(data.goodsAmount)) {
    throw LogisticsException.notInRange('GoodsAmount', validAmounts)
    // 錯誤訊息: "GoodsAmount 必須為下列值之一：60, 90, 120"
  }
}

// 使用方式
try {
  validateOrder({ merchantTradeNo: '', goodsAmount: 100 })
} catch (error) {
  if (error instanceof LogisticsException) {
    console.error('驗證錯誤:', error.message)
  }
}
```

### 6. 完整 API 呼叫範例

```typescript
import {
  ApiMode,
  getApiUrl,
  PayloadEncoder,
  Response,
  LogisticsException,
  type EcPayConfig,
} from '@carllee1983/ecpay-fulllogistics'

async function createLogisticsOrder(orderData: {
  merchantTradeNo: string
  goodsAmount: number
  goodsName: string
  receiverName: string
  receiverPhone: string
  receiverStoreId: string
}) {
  // 設定
  const config: EcPayConfig = {
    merchantId: '2000132',
    hashKey: '5294y06JbISpM5x9',
    hashIv: 'v77hoKGq4kWxNNIS',
    mode: ApiMode.Staging,
  }

  const encoder = new PayloadEncoder(config.hashKey, config.hashIv)

  // 建立請求資料
  const payload = encoder.encode(config.merchantId, {
    MerchantTradeNo: orderData.merchantTradeNo,
    LogisticsType: 'CVS',
    LogisticsSubType: 'UNIMART',
    GoodsAmount: orderData.goodsAmount,
    GoodsName: orderData.goodsName,
    SenderName: '商店名稱',
    SenderCellPhone: '0912345678',
    ReceiverName: orderData.receiverName,
    ReceiverCellPhone: orderData.receiverPhone,
    ReceiverStoreID: orderData.receiverStoreId,
    ServerReplyURL: 'https://your-domain.com/logistics/callback',
  })

  try {
    // 發送 API 請求
    const apiUrl = getApiUrl(config.mode) + '/Express/v2/CreateOrder'
    const result = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const apiResponse = await result.json()
    const response = new Response(apiResponse, encoder)

    if (response.isSuccess()) {
      return {
        success: true,
        logisticsId: response.getAllPayLogisticsID(),
        validationNo: response.getCVSValidationNo(),
        data: response.getData(),
      }
    } else {
      throw LogisticsException.apiError(response.getRtnCode(), response.getRtnMsg())
    }
  } catch (error) {
    if (error instanceof LogisticsException) {
      throw error
    }
    throw LogisticsException.httpError(String(error))
  }
}

// 使用方式
createLogisticsOrder({
  merchantTradeNo: 'ORDER_' + Date.now(),
  goodsAmount: 500,
  goodsName: '測試商品',
  receiverName: '王小明',
  receiverPhone: '0987654321',
  receiverStoreId: '991182',
})
  .then((result) => console.log('成功:', result))
  .catch((error) => console.error('失敗:', error.message))
```

## 📖 API 參考

### `ApiMode`

API 環境列舉：

| 值           | 網址                                   |
| ------------ | -------------------------------------- |
| `Production` | `https://logistics.ecpay.com.tw`       |
| `Staging`    | `https://logistics-stage.ecpay.com.tw` |

### `EcPayConfig`

```typescript
interface EcPayConfig {
  merchantId: string // 綠界特店編號
  hashKey: string // 16 字元 Hash Key
  hashIv: string // 16 字元 Hash IV
  mode?: ApiMode // API 模式 (預設為 Staging)
}
```

### `CipherService`

| 方法              | 說明                           |
| ----------------- | ------------------------------ |
| `encrypt(text)`   | 加密文字，回傳 Base64 字串     |
| `decrypt(cipher)` | 解密 Base64 字串，回傳原始文字 |

### `PayloadEncoder`

| 方法                       | 說明                      |
| -------------------------- | ------------------------- |
| `encode(merchantId, data)` | 建立加密後的 API 請求資料 |
| `decode<T>(encryptedData)` | 解密 API 回應的 Data 字串 |

### `Response<T>`

| 方法                     | 回傳類型  | 說明                  |
| ------------------------ | --------- | --------------------- |
| `isSuccess()`            | `boolean` | 檢查 RtnCode 是否為 1 |
| `getRtnCode()`           | `number`  | 取得回傳代碼          |
| `getRtnMsg()`            | `string`  | 取得回傳訊息          |
| `getData()`              | `T`       | 取得完整資料物件      |
| `get(key)`               | `unknown` | 取得特定欄位          |
| `getAllPayLogisticsID()` | `string?` | 取得綠界物流編號      |
| `getLogisticsStatus()`   | `string?` | 取得物流狀態          |
| `getMerchantTradeNo()`   | `string?` | 取得廠商交易編號      |
| `getShipmentNo()`        | `string?` | 取得托運單號          |
| `getCVSValidationNo()`   | `string?` | 取得驗證碼            |
| `getPrintUrl()`          | `string?` | 取得列印網址          |
| `getReceiverStoreID()`   | `string?` | 取得收件門市代號      |
| `getReceiverStoreName()` | `string?` | 取得收件門市名稱      |

### `LogisticsException`

| 工廠方法                    | 錯誤訊息範例                                |
| --------------------------- | ------------------------------------------- |
| `required(field)`           | `MerchantTradeNo 為必填欄位。`              |
| `invalid(field, reason?)`   | `MerchantTradeNo 格式無效：只能包含英數字`  |
| `tooLong(field, maxLength)` | `MerchantTradeNo 不可超過 20 個字元。`      |
| `httpError(message)`        | `HTTP 請求錯誤：Connection timeout`         |
| `apiError(code, message)`   | `API 錯誤 [10100001]：參數錯誤`             |
| `notInRange(field, values)` | `LogisticsType 必須為下列值之一：CVS, HOME` |

## 🔐 安全性注意事項

> ⚠️ **請勿將 HashKey/HashIV 顯示於前端程式碼** (JavaScript、HTML、CSS)。務必使用環境變數或安全的設定方式。

```typescript
// ✅ 正確: 使用環境變數
const config: EcPayConfig = {
  merchantId: process.env.ECPAY_MERCHANT_ID!,
  hashKey: process.env.ECPAY_HASH_KEY!,
  hashIv: process.env.ECPAY_HASH_IV!,
  mode: process.env.NODE_ENV === 'production' ? ApiMode.Production : ApiMode.Staging,
}

// ❌ 錯誤: 在前端程式碼中寫死憑證
```

## 🧪 測試環境

| 類型 | 特店編號 | HashKey          | HashIV           |
| ---- | -------- | ---------------- | ---------------- |
| C2C  | 2000132  | 5294y06JbISpM5x9 | v77hoKGq4kWxNNIS |
| B2C  | 2000933  | XBERn1YOvpM9nfZc | h1ONHk4P4yqbl5LK |

- **測試環境網址**: `https://logistics-stage.ecpay.com.tw`
- **正式環境網址**: `https://logistics.ecpay.com.tw`

## 🛠 開發

### 環境需求

- [Bun](https://bun.sh/) >= 1.0
- Node.js >= 18 (相容性支援)

### 設定

```bash
git clone https://github.com/CarlLee1983/ecpay-fulllogistics-node.git
cd ecpay-fulllogistics-node
bun install
```

### 指令

| 指令                    | 說明                       |
| ----------------------- | -------------------------- |
| `bun run build`         | 建置 ESM、CJS 與型別宣告檔 |
| `bun test`              | 執行測試                   |
| `bun run test:coverage` | 執行測試並產生覆蓋率報告   |
| `bun run typecheck`     | TypeScript 型別檢查        |
| `bun run lint`          | 執行 ESLint                |
| `bun run format`        | 使用 Prettier 格式化程式碼 |

## 📚 相關資源

- [綠界全方位物流 API 技術文件](https://developers.ecpay.com.tw/?p=10075)
- [綠界特店管理後台 (測試環境)](https://vendor-stage.ecpay.com.tw/)

## 📝 授權

[MIT](LICENSE) © Carl

## 🤝 貢獻

歡迎貢獻！請參閱 [貢獻指南](CONTRIBUTING.md) 了解詳情。

## 🔒 安全性

如有安全疑慮，請參閱 [安全政策](SECURITY.md)。
