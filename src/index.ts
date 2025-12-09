export * from './core/CipherService.js'
export * from './core/PayloadEncoder.js'
export * from './core/Response.js'
export * from './exceptions/LogisticsException.js'

/**
 * SDK Version
 */
export const VERSION = '0.0.1'

/**
 * ECPay Full Logistics API Modes
 */
export const enum ApiMode {
  /** Production environment */
  Production = 'production',
  /** Staging/Test environment */
  Staging = 'staging',
}

/**
 * ECPay Full Logistics API URLs
 */
export const API_URLS = {
  [ApiMode.Production]: 'https://logistics.ecpay.com.tw',
  [ApiMode.Staging]: 'https://logistics-stage.ecpay.com.tw',
} as const

/**
 * Configuration for the ECPay Full Logistics client
 */
export interface EcPayConfig {
  /** Merchant ID provided by ECPay */
  merchantId: string
  /** Hash Key for request signing */
  hashKey: string
  /** Hash IV for request signing */
  hashIv: string
  /** API mode (production or staging) */
  mode?: ApiMode
}

/**
 * Validates the ECPay configuration
 */
export function validateConfig(config: EcPayConfig): boolean {
  if (!config.merchantId || config.merchantId.length === 0) {
    return false
  }
  if (!config.hashKey || config.hashKey.length === 0) {
    return false
  }
  if (!config.hashIv || config.hashIv.length === 0) {
    return false
  }
  return true
}

/**
 * Creates the API base URL based on the mode
 */
export function getApiUrl(mode: ApiMode = ApiMode.Staging): string {
  return API_URLS[mode]
}
