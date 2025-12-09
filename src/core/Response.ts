import { PayloadEncoder } from './PayloadEncoder.js'

export interface BaseResponseData {
  RtnCode: number
  RtnMsg: string
  [key: string]: unknown
}

export interface EncryptedResponse {
  TransCode: number
  TransMsg: string
  Data: string | Record<string, unknown> // Can be encrypted string or plain object
  [key: string]: unknown
}

/**
 * API Response Wrapper
 *
 * Wraps the raw API response and provides helper methods to access data.
 * Handles automatic decryption of the 'Data' field if it is encrypted.
 */
export class Response<T = Record<string, unknown>> {
  protected data: T & BaseResponseData
  protected rawResponse: EncryptedResponse

  /**
   * @param response Raw API response
   * @param encoder PayloadEncoder for decryption (optional)
   */
  constructor(response: EncryptedResponse, encoder?: PayloadEncoder) {
    this.rawResponse = response

    // Handle Data field
    let decryptedData: Record<string, unknown> = {}

    if (typeof response.Data === 'string' && encoder) {
      // Decrypt if it's a string and we have an encoder
      try {
        decryptedData = encoder.decode(response.Data)
      } catch (e) {
        console.warn('Failed to decrypt response data:', e)
        // Keep as empty object or handle error
      }
    } else if (typeof response.Data === 'object' && response.Data !== null) {
      // It's already an object (sometimes happens in error cases or specific APIs)
      decryptedData = response.Data as Record<string, unknown>
    }

    // Merge everything into a single data object for easy access
    this.data = {
      ...response, // Include top-level fields like TransCode
      ...decryptedData, // Include decrypted fields
    } as unknown as T & BaseResponseData

    // Map TransCode/TransMsg to RtnCode/RtnMsg if needed
    if (response.TransCode !== undefined && this.data.RtnCode === undefined) {
      this.data.RtnCode = response.TransCode
    }
    if (response.TransMsg !== undefined && this.data.RtnMsg === undefined) {
      this.data.RtnMsg = response.TransMsg
    }
  }

  /**
   * Check if the request was successful
   */
  isSuccess(): boolean {
    return this.data.RtnCode === 1
  }

  /**
   * Get return code
   */
  getRtnCode(): number {
    return this.data.RtnCode
  }

  /**
   * Get return message
   */
  getRtnMsg(): string {
    return this.data.RtnMsg
  }

  /**
   * Get the full data object
   */
  getData(): T & BaseResponseData {
    return this.data
  }

  /**
   * Get a specific field
   */
  get<K extends keyof (T & BaseResponseData)>(key: K): (T & BaseResponseData)[K] {
    return this.data[key]
  }

  // Common Getter Methods

  /**
   * Get ECPay Logistics ID
   */
  getAllPayLogisticsID(): string | undefined {
    return this.data['AllPayLogisticsID'] as string | undefined
  }

  /**
   * Get Logistics Status
   */
  getLogisticsStatus(): string | undefined {
    return this.data['LogisticsStatus'] as string | undefined
  }

  /**
   * Get Merchant Trade No
   */
  getMerchantTradeNo(): string | undefined {
    return this.data['MerchantTradeNo'] as string | undefined
  }

  /**
   * Get Shipment No
   */
  getShipmentNo(): string | undefined {
    return this.data['ShipmentNo'] as string | undefined
  }

  /**
   * Get Print URL
   */
  getPrintUrl(): string | undefined {
    return this.data['PrintUrl'] as string | undefined
  }

  /**
   * Get CVS Validation No
   */
  getCVSValidationNo(): string | undefined {
    return this.data['CVSValidationNo'] as string | undefined
  }

  /**
   * Get Receiver Store ID
   */
  getReceiverStoreID(): string | undefined {
    return this.data['ReceiverStoreID'] as string | undefined
  }

  /**
   * Get Receiver Store Name
   */
  getReceiverStoreName(): string | undefined {
    return this.data['ReceiverStoreName'] as string | undefined
  }
}
