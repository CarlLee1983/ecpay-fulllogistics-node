import { CipherService } from './CipherService.js'

export interface RqHeader {
  Timestamp: number
  Revision: string
}

export interface EncryptedPayload {
  MerchantID: string
  RqHeader: RqHeader
  Data: string
}

/**
 * Service for encoding and decoding API payloads
 */
export class PayloadEncoder {
  private readonly cipher: CipherService

  /**
   * @param hashKey Merchant HashKey
   * @param hashIv Merchant HashIV
   */
  constructor(hashKey: string, hashIv: string) {
    this.cipher = new CipherService(hashKey, hashIv)
  }

  /**
   * Encodes request data into encrypted payload
   *
   * @param merchantId Merchant ID
   * @param data Request data object
   * @returns Encrypted payload ready for API
   */
  encode(merchantId: string, data: Record<string, unknown>): EncryptedPayload {
    // 1. JSON Stringify the data
    const jsonString = JSON.stringify(data)

    // 2. Encrypt the JSON string
    const encryptedData = this.cipher.encrypt(jsonString)

    // 3. Construct the full payload
    return {
      MerchantID: merchantId,
      RqHeader: {
        Timestamp: Math.floor(Date.now() / 1000),
        Revision: '1.0.0',
      },
      Data: encryptedData,
    }
  }

  /**
   * Decodes encrypted response payload
   *
   * @param encryptedData Encrypted Data string
   * @returns Decrypted data object
   */
  decode<T = Record<string, unknown>>(encryptedData: string): T {
    // 1. Decrypt the data
    const jsonString = this.cipher.decrypt(encryptedData)

    // 2. Parse JSON
    try {
      return JSON.parse(jsonString) as T
    } catch {
      // If parsing fails, it might be an empty string or invalid JSON
      // Return empty object or throw error based on requirement
      // For now, let JSON.parse throw syntax error if invalid
      throw new Error('Failed to parse decrypted response data as JSON')
    }
  }
}
