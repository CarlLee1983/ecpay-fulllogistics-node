import { ApiMode } from './parameters/ApiMode.js'

// Core
export * from './core/CipherService.js'
export * from './core/PayloadEncoder.js'
export * from './core/Response.js'
export * from './core/BaseAction.js'

// Exceptions
export * from './exceptions/LogisticsException.js'

/**
 * SDK Version
 */
import { version } from '../package.json'

export const VERSION = version

/**
 * ECPay Full Logistics API URLs
 */
export const API_URLS = {
  [ApiMode.Production]: 'https://logistics.ecpay.com.tw',
  [ApiMode.Stage]: 'https://logistics-stage.ecpay.com.tw',
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

// Parameters
export * from './parameters/LogisticsType.js'
export * from './parameters/LogisticsSubType.js'
export * from './parameters/Temperature.js'
export * from './parameters/Distance.js'
export * from './parameters/Specification.js'
export * from './parameters/IsCollection.js'
export * from './parameters/ScheduledPickupTime.js'
export * from './parameters/ScheduledDeliveryTime.js'

// Operations
export * from './operations/CreateLogisticsOrder.js'
export * from './operations/OpenLogisticsSelection.js'

// Queries
export * from './queries/QueryLogisticsOrder.js'

// Printing
export * from './printing/PrintTradeDocument.js'

// Mutations
export * from './mutations/UpdateB2COrder.js'
export * from './mutations/UpdateC2COrder.js'
export * from './mutations/CancelC2COrder.js'
export * from './operations/UpdateTempTrade.js'

// Reverse
export * from './reverse/ReturnHome.js'
export * from './reverse/ReturnCVS.js'

// Notifications
export * from './notifications/LogisticsNotify.js'

// Utilities
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
export function getApiUrl(mode: ApiMode = ApiMode.Stage): string {
  return API_URLS[mode]
}
