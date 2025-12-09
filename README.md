# @carllee1983/ecpay-fulllogistics

[English](README.md) | [繁體中文](README_TW.md)

[![npm version](https://img.shields.io/npm/v/@carllee1983/ecpay-fulllogistics.svg)](https://www.npmjs.com/package/@carllee1983/ecpay-fulllogistics)
[![CI](https://github.com/CarlLee1983/ecpay-fulllogistics-node/actions/workflows/ci.yml/badge.svg)](https://github.com/CarlLee1983/ecpay-fulllogistics-node/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.x-orange.svg)](https://bun.sh/)

> Unofficial ECPay Full Logistics (綠界全方位物流) SDK for Node.js. Type-safe & Bun-compatible.

## ✨ Features

- 🚀 **Modern TypeScript** - Full type safety with strict mode
- 📦 **Dual Module Support** - ESM (primary) and CJS builds
- 🧪 **95%+ Test Coverage** - Production-ready with enforced coverage thresholds
- ⚡ **Bun Optimized** - Built and tested with Bun for maximum performance
- 🔒 **AES-128-CBC Encryption** - Built-in encryption/decryption compatible with ECPay API
- 📋 **JSON-based API** - Uses ECPay's new JSON + AES encryption format

## 📦 Installation

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

## 🚀 Quick Start

### Basic Configuration

```typescript
import {
  ApiMode,
  getApiUrl,
  validateConfig,
  type EcPayConfig,
} from '@carllee1983/ecpay-fulllogistics'

// Use test credentials for staging environment
const config: EcPayConfig = {
  merchantId: '2000132',
  hashKey: '5294y06JbISpM5x9',
  hashIv: 'v77hoKGq4kWxNNIS',
  mode: ApiMode.Staging,
}

// Validate before use
if (validateConfig(config)) {
  console.log('✅ Configuration valid')
  console.log('📍 API URL:', getApiUrl(config.mode))
  // Output: https://logistics-stage.ecpay.com.tw
}
```

## 📖 Usage Examples

### 1. AES Encryption/Decryption

The `CipherService` handles AES-128-CBC encryption compatible with ECPay's specification:

```typescript
import { CipherService } from '@carllee1983/ecpay-fulllogistics'

// Initialize with 16-character keys
const cipher = new CipherService('5294y06JbISpM5x9', 'v77hoKGq4kWxNNIS')

// Encrypt data (automatically URL-encodes before encryption)
const plaintext = '{"MerchantTradeNo":"ORDER123","GoodsAmount":1000}'
const encrypted = cipher.encrypt(plaintext)
console.log('Encrypted:', encrypted)
// Output: Base64 encoded string

// Decrypt data (automatically URL-decodes after decryption)
const decrypted = cipher.decrypt(encrypted)
console.log('Decrypted:', decrypted)
// Output: {"MerchantTradeNo":"ORDER123","GoodsAmount":1000}
```

### 2. Building API Request Payloads

The `PayloadEncoder` creates properly formatted request payloads:

```typescript
import { PayloadEncoder } from '@carllee1983/ecpay-fulllogistics'

const encoder = new PayloadEncoder('5294y06JbISpM5x9', 'v77hoKGq4kWxNNIS')

// Build encrypted payload for API request
const payload = encoder.encode('2000132', {
  MerchantTradeNo: 'ORDER_' + Date.now(),
  LogisticsType: 'CVS',
  LogisticsSubType: 'UNIMART',
  GoodsAmount: 1000,
  GoodsName: 'Test Product',
  SenderName: 'Sender',
  SenderCellPhone: '0912345678',
  ReceiverName: 'Receiver',
  ReceiverCellPhone: '0987654321',
  ReceiverStoreID: '991182',
  ServerReplyURL: 'https://your-domain.com/callback',
})

console.log('Request Payload:', JSON.stringify(payload, null, 2))
// Output:
// {
//   "MerchantID": "2000132",
//   "RqHeader": {
//     "Timestamp": 1733749200,
//     "Revision": "1.0.0"
//   },
//   "Data": "encrypted_base64_string..."
// }

// Send to ECPay API
const response = await fetch('https://logistics-stage.ecpay.com.tw/Express/v2/CreateOrder', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})
```

### 3. Parsing API Responses

The `Response` class provides convenient methods for handling ECPay responses:

```typescript
import { PayloadEncoder, Response } from '@carllee1983/ecpay-fulllogistics'

const encoder = new PayloadEncoder('5294y06JbISpM5x9', 'v77hoKGq4kWxNNIS')

// Simulated API response from ECPay
const apiResponse = {
  TransCode: 1,
  TransMsg: 'Success',
  Data: 'encrypted_response_string...',
}

// Create Response wrapper with automatic decryption
const response = new Response(apiResponse, encoder)

// Check success status
if (response.isSuccess()) {
  // Use convenience getters
  console.log('Logistics ID:', response.getAllPayLogisticsID())
  console.log('Merchant Trade No:', response.getMerchantTradeNo())
  console.log('Logistics Status:', response.getLogisticsStatus())
  console.log('Shipment No:', response.getShipmentNo())
  console.log('CVS Validation No:', response.getCVSValidationNo())
  console.log('Print URL:', response.getPrintUrl())
  console.log('Receiver Store ID:', response.getReceiverStoreID())
  console.log('Receiver Store Name:', response.getReceiverStoreName())

  // Or access specific fields
  const goodsAmount = response.get('GoodsAmount')
  console.log('Goods Amount:', goodsAmount)

  // Or get the full data object
  const fullData = response.getData()
  console.log('Full Response:', fullData)
} else {
  console.error('API Error:', response.getRtnCode(), response.getRtnMsg())
}
```

### 4. Handling Responses Without Encryption

Some API responses may not be encrypted:

```typescript
import { Response } from '@carllee1983/ecpay-fulllogistics'

// Response with unencrypted Data object
const errorResponse = {
  TransCode: 0,
  TransMsg: 'Parameter Error',
  Data: {
    RtnCode: 10100001,
    RtnMsg: 'MerchantTradeNo is required',
  },
}

// Create Response without encoder
const response = new Response(errorResponse)

if (!response.isSuccess()) {
  console.error('Error Code:', response.getRtnCode())
  console.error('Error Message:', response.getRtnMsg())
}
```

### 5. Error Handling with LogisticsException

Use `LogisticsException` for consistent error handling:

```typescript
import { LogisticsException } from '@carllee1983/ecpay-fulllogistics'

function validateOrder(data: {
  merchantTradeNo?: string
  goodsAmount?: number
  senderName?: string
}) {
  // Required field validation
  if (!data.merchantTradeNo) {
    throw LogisticsException.required('MerchantTradeNo')
    // Error: "MerchantTradeNo 為必填欄位。"
  }

  // Length validation
  if (data.merchantTradeNo.length > 20) {
    throw LogisticsException.tooLong('MerchantTradeNo', 20)
    // Error: "MerchantTradeNo 不可超過 20 個字元。"
  }

  // Format validation
  if (!/^[A-Za-z0-9]+$/.test(data.merchantTradeNo)) {
    throw LogisticsException.invalid('MerchantTradeNo', '只能包含英數字')
    // Error: "MerchantTradeNo 格式無效：只能包含英數字"
  }

  // Range validation
  const validAmounts = [60, 90, 120]
  if (data.goodsAmount && !validAmounts.includes(data.goodsAmount)) {
    throw LogisticsException.notInRange('GoodsAmount', validAmounts)
    // Error: "GoodsAmount 必須為下列值之一：60, 90, 120"
  }
}

// Usage
try {
  validateOrder({ merchantTradeNo: '', goodsAmount: 100 })
} catch (error) {
  if (error instanceof LogisticsException) {
    console.error('Validation Error:', error.message)
  }
}
```

### 6. Create Logistics Order

```typescript
import {
  EcPayConfig,
  ApiMode,
  CreateLogisticsOrder,
  LogisticsSubType,
  IsCollection,
  LogisticsException,
} from '@carllee1983/ecpay-fulllogistics'

const config: EcPayConfig = {
  merchantId: '2000132',
  hashKey: '5294y06JbISpM5x9',
  hashIv: 'v77hoKGq4kWxNNIS',
  mode: ApiMode.Staging,
}

try {
  const create = new CreateLogisticsOrder(config)

  create
    .setMerchantTradeNo('LOG123456789')
    .setMerchantTradeDate(new Date())
    .setLogisticsSubType(LogisticsSubType.UNIMART)
    .setGoodsAmount(100)
    .setGoodsName('Test Goods')
    .setSenderName('Sender')
    .setSenderCellPhone('0912345678')
    .setReceiverName('Receiver')
    .setReceiverCellPhone('0987654321')
    .setReceiverStoreID('123456') // Store ID for UNIMART
    .setServerReplyURL('https://example.com/reply')

  const response = await create.send()

  if (response.isSuccess()) {
    console.log('Logistics ID:', response.getAllPayLogisticsID())
  } else {
    console.error('Error:', response.getRtnMsg())
  }
} catch (error) {
  if (error instanceof LogisticsException) {
    console.error('Validation Error:', error.message)
  } else {
    console.error(error)
  }
}
```

### 7. Open Logistics Selection

```typescript
import {
  EcPayConfig,
  ApiMode,
  OpenLogisticsSelection,
  LogisticsSubType,
} from '@carllee1983/ecpay-fulllogistics'

const config: EcPayConfig = {
  merchantId: '2000132',
  hashKey: '5294y06JbISpM5x9',
  hashIv: 'v77hoKGq4kWxNNIS',
  mode: ApiMode.Staging,
}

const selection = new OpenLogisticsSelection(config)
selection
  .setLogisticsSubType(LogisticsSubType.UNIMART)
  .setServerReplyURL('https://example.com/reply') // ECPay will post data here
  .setClientReplyURL('https://example.com/return') // Redirect user here after selection

// Generate HTML form to submit to ECPay
const htmlForm = selection.generateForm()

// Return this HTML to the browser
// res.send(htmlForm)
```

### 8. Query Logistics Order

```typescript
import { EcPayConfig, ApiMode, QueryLogisticsOrder } from '@carllee1983/ecpay-fulllogistics'

const query = new QueryLogisticsOrder(config)
query.setAllPayLogisticsID('12345678')

const response = await query.send()
console.log('Status:', response.getLogisticsStatus())
```

### 9. Print Trade Document

```typescript
import { PrintTradeDocument } from '@carllee1983/ecpay-fulllogistics'

const print = new PrintTradeDocument(config)
print.setAllPayLogisticsID('12345678')

// Generate HTML form to submit to ECPay
const htmlForm = print.generateForm()
```

### 10. Logistics Notification Handling

```typescript
import { LogisticsNotify } from '@carllee1983/ecpay-fulllogistics'

// In your controller (e.g., Express.js)
const notify = new LogisticsNotify('HashKey', 'HashIV')
notify.handle(req.body)

if (notify.isSuccess()) {
  console.log('Logistics ID:', notify.getAllPayLogisticsID())
  console.log('Status:', notify.getLogisticsStatusName())
  // Return "1|OK" to ECPay
  res.send(notify.getSuccessResponse())
} else {
  // Return error
  res.send(notify.getFailResponse('CheckSum Failed'))
}
```

### 11. Other Operations (Mutations & Reverse)

The SDK supports various other operations:

- `UpdateTempTrade`: Update temporary order (before shipping)
- `CancelC2COrder`: Cancel C2C order
- `UpdateB2COrder`: Update B2C shipment info
- `ReturnHome`: Create Home Return order
- `ReturnCVS`: Create CVS Return order

```typescript
import {
  UpdateTempTrade,
  CancelC2COrder,
  ReturnCVS,
  LogisticsSubType,
} from '@carllee1983/ecpay-fulllogistics'

// Example: Cancel C2C Order
const cancel = new CancelC2COrder(config)
cancel
  .setAllPayLogisticsID('12345678')
  .setLogisticsSubType(LogisticsSubType.UNIMART_C2C)
  .setCVSValidationNo('1111')
const res = await cancel.send()
```

## 📖 API Reference

### `ApiMode`

Enum for API environments:

| Value        | URL                                    |
| ------------ | -------------------------------------- |
| `Production` | `https://logistics.ecpay.com.tw`       |
| `Staging`    | `https://logistics-stage.ecpay.com.tw` |

### `EcPayConfig`

```typescript
interface EcPayConfig {
  merchantId: string // ECPay Merchant ID
  hashKey: string // 16-character Hash Key
  hashIv: string // 16-character Hash IV
  mode?: ApiMode // API mode (defaults to Staging)
}
```

### `CipherService`

| Method            | Description                          |
| ----------------- | ------------------------------------ |
| `encrypt(text)`   | Encrypts text, returns Base64 string |
| `decrypt(cipher)` | Decrypts Base64 string, returns text |

### `PayloadEncoder`

| Method                     | Description                           |
| -------------------------- | ------------------------------------- |
| `encode(merchantId, data)` | Creates encrypted API request payload |
| `decode<T>(encryptedData)` | Decrypts API response data string     |

### `Response<T>`

| Method                   | Return Type | Description             |
| ------------------------ | ----------- | ----------------------- |
| `isSuccess()`            | `boolean`   | Check if RtnCode === 1  |
| `getRtnCode()`           | `number`    | Get return code         |
| `getRtnMsg()`            | `string`    | Get return message      |
| `getData()`              | `T`         | Get full data object    |
| `get(key)`               | `unknown`   | Get specific field      |
| `getAllPayLogisticsID()` | `string?`   | Get ECPay Logistics ID  |
| `getLogisticsStatus()`   | `string?`   | Get logistics status    |
| `getMerchantTradeNo()`   | `string?`   | Get merchant trade no   |
| `getShipmentNo()`        | `string?`   | Get shipment number     |
| `getCVSValidationNo()`   | `string?`   | Get CVS validation no   |
| `getPrintUrl()`          | `string?`   | Get print URL           |
| `getReceiverStoreID()`   | `string?`   | Get receiver store ID   |
| `getReceiverStoreName()` | `string?`   | Get receiver store name |

### `LogisticsException`

| Factory Method              | Error Message Example                       |
| --------------------------- | ------------------------------------------- |
| `required(field)`           | `MerchantTradeNo 為必填欄位。`              |
| `invalid(field, reason?)`   | `MerchantTradeNo 格式無效：只能包含英數字`  |
| `tooLong(field, maxLength)` | `MerchantTradeNo 不可超過 20 個字元。`      |
| `httpError(message)`        | `HTTP 請求錯誤：Connection timeout`         |
| `apiError(code, message)`   | `API 錯誤 [10100001]：參數錯誤`             |
| `notInRange(field, values)` | `LogisticsType 必須為下列值之一：CVS, HOME` |

## 🔐 Security Notice

> ⚠️ **Never expose HashKey/HashIV in frontend code** (JavaScript, HTML, CSS). Always use environment variables or secure configuration.

```typescript
// ✅ Good: Use environment variables
const config: EcPayConfig = {
  merchantId: process.env.ECPAY_MERCHANT_ID!,
  hashKey: process.env.ECPAY_HASH_KEY!,
  hashIv: process.env.ECPAY_HASH_IV!,
  mode: process.env.NODE_ENV === 'production' ? ApiMode.Production : ApiMode.Staging,
}

// ❌ Bad: Hardcoded credentials in client code
```

## 🧪 Test Environment

| Type | Merchant ID | HashKey          | HashIV           |
| ---- | ----------- | ---------------- | ---------------- |
| C2C  | 2000132     | 5294y06JbISpM5x9 | v77hoKGq4kWxNNIS |
| B2C  | 2000933     | XBERn1YOvpM9nfZc | h1ONHk4P4yqbl5LK |

- **Staging URL**: `https://logistics-stage.ecpay.com.tw`
- **Production URL**: `https://logistics.ecpay.com.tw`

## 🛠 Development

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0
- Node.js >= 18 (for compatibility)

### Setup

```bash
git clone https://github.com/CarlLee1983/ecpay-fulllogistics-node.git
cd ecpay-fulllogistics-node
bun install
```

### Scripts

| Command                 | Description                           |
| ----------------------- | ------------------------------------- |
| `bun run build`         | Build ESM, CJS, and type declarations |
| `bun test`              | Run tests                             |
| `bun run test:coverage` | Run tests with coverage report        |
| `bun run typecheck`     | TypeScript type checking              |
| `bun run lint`          | Run ESLint                            |
| `bun run format`        | Format code with Prettier             |

## 📚 Resources

- [ECPay Full Logistics API Documentation](https://developers.ecpay.com.tw/?p=10075)
- [ECPay Vendor Portal (Staging)](https://vendor-stage.ecpay.com.tw/)

## 📝 License

[MIT](LICENSE) © Carl

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) for details.

## 🔒 Security

For security concerns, please see our [Security Policy](SECURITY.md).
