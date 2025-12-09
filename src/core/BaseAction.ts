import { type EcPayConfig } from '../types/EcPayConfig.js'
import { ApiMode } from '../parameters/ApiMode.js'
import { PayloadEncoder, type EncryptedPayload } from './PayloadEncoder.js'
import { Response, type EncryptedResponse } from './Response.js'
import { LogisticsException } from '../exceptions/LogisticsException.js'

interface ActionContent {
  MerchantID: string
  RqHeader: {
    Timestamp: number
    Revision: string
  }
  Data: any
}

export abstract class BaseAction {
  /**
   * Maximum length for MerchantTradeNo
   */
  public static readonly MERCHANT_TRADE_NO_MAX_LENGTH = 20

  protected config: EcPayConfig
  protected encoder: PayloadEncoder
  protected content: ActionContent = {
    MerchantID: '',
    RqHeader: {
      Timestamp: 0,
      Revision: '1.0.0',
    },
    Data: {},
  }

  protected abstract requestPath: string

  constructor(config: EcPayConfig) {
    this.config = config
    this.encoder = new PayloadEncoder(config.hashKey, config.hashIv)
    this.content.MerchantID = config.merchantId
    this.content.Data.MerchantID = config.merchantId
  }

  /**
   * Set MerchantTradeNo
   */
  public setMerchantTradeNo(tradeNo: string): this {
    if (tradeNo.length > BaseAction.MERCHANT_TRADE_NO_MAX_LENGTH) {
      throw LogisticsException.tooLong('MerchantTradeNo', BaseAction.MERCHANT_TRADE_NO_MAX_LENGTH)
    }
    this.content.Data.MerchantTradeNo = tradeNo
    return this
  }

  /**
   * Set MerchantTradeDate
   */
  public setMerchantTradeDate(date: string | Date): this {
    const dateStr = date instanceof Date ? this.formatDate(date) : date
    this.content.Data.MerchantTradeDate = dateStr
    return this
  }

  /**
   * Set ServerReplyURL
   */
  public setServerReplyURL(url: string): this {
    this.content.Data.ServerReplyURL = url
    return this
  }

  /**
   * Set ClientReplyURL
   */
  public setClientReplyURL(url: string): this {
    this.content.Data.ClientReplyURL = url
    return this
  }

  /**
   * Set PlatformID
   */
  public setPlatformID(id: string): this {
    if (id) {
      this.content.Data.PlatformID = id
    }
    return this
  }

  /**
   * Set Remark
   */
  public setRemark(remark: string): this {
    this.content.Data.Remark = remark
    return this
  }

  /**
   * Validate parameters
   */
  protected abstract validate(): void

  /**
   * Send the request to ECPay API
   */
  public async send(): Promise<Response<any>> {
    this.validate()

    // Update Timestamp
    this.content.RqHeader.Timestamp = Math.floor(Date.now() / 1000)

    // Encode payload
    const payload = this.encoder.encode(
      this.config.merchantId,
      this.content.Data,
      this.content.RqHeader
    )

    const apiUrl = this.getApiUrl() + this.requestPath

    try {
      const result = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const apiResponse = (await result.json()) as EncryptedResponse
      const response = new Response(apiResponse, this.encoder)

      return response
    } catch (error) {
      if (error instanceof LogisticsException) {
        throw error
      }
      throw LogisticsException.httpError(String(error))
    }
  }

  /**
   * Get the API URL based on the mode
   */
  protected getApiUrl(): string {
    const staging = 'https://logistics-stage.ecpay.com.tw'
    const production = 'https://logistics.ecpay.com.tw'
    return this.config.mode === ApiMode.Production ? production : staging
  }

  protected formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
  }
}
