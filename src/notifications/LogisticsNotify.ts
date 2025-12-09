import { CipherService } from '../core/CipherService.js'

export class LogisticsNotify {
  protected hashKey: string
  protected hashIv: string
  protected data: Record<string, any> = {}
  protected decryptedData: Record<string, any> | null = null

  constructor(hashKey: string, hashIv: string) {
    this.hashKey = hashKey
    this.hashIv = hashIv
  }

  /**
   * Handle the notification
   */
  public handle(postData: Record<string, any>): this {
    this.data = postData

    if (postData['Data'] && typeof postData['Data'] === 'string') {
      const cipher = new CipherService(this.hashKey, this.hashIv)
      try {
        const decrypted = cipher.decrypt(postData['Data'])
        try {
          this.decryptedData = JSON.parse(decodeURIComponent(decrypted))
        } catch (e) {
          try {
            this.decryptedData = JSON.parse(decrypted)
          } catch (e2) {
            this.decryptedData = {}
          }
        }
      } catch (e) {
        // Decryption failed
        this.decryptedData = {}
      }
    }
    return this
  }

  public getRtnCode(): number {
    return Number(this.data['RtnCode'] ?? 0)
  }

  public getRtnMsg(): string {
    return this.data['RtnMsg'] ?? ''
  }

  public isSuccess(): boolean {
    return this.getRtnCode() === 1
  }

  public getAllPayLogisticsID(): string | null {
    return this.decryptedData?.['AllPayLogisticsID'] ?? this.data['AllPayLogisticsID'] ?? null
  }

  public getMerchantTradeNo(): string | null {
    return this.decryptedData?.['MerchantTradeNo'] ?? this.data['MerchantTradeNo'] ?? null
  }

  public getLogisticsStatus(): string | null {
    return this.decryptedData?.['LogisticsStatus'] ?? this.data['LogisticsStatus'] ?? null
  }

  public getLogisticsStatusName(): string | null {
    return this.decryptedData?.['LogisticsStatusName'] ?? this.data['LogisticsStatusName'] ?? null
  }

  public getGoodsAmount(): number | null {
    const val = this.decryptedData?.['GoodsAmount'] ?? this.data['GoodsAmount'] ?? null
    return val !== null ? Number(val) : null
  }

  public getUpdateStatusDate(): string | null {
    return this.decryptedData?.['UpdateStatusDate'] ?? this.data['UpdateStatusDate'] ?? null
  }

  public getReceiverStoreID(): string | null {
    return this.decryptedData?.['ReceiverStoreID'] ?? this.data['ReceiverStoreID'] ?? null
  }

  public getReceiverStoreName(): string | null {
    return this.decryptedData?.['ReceiverStoreName'] ?? this.data['ReceiverStoreName'] ?? null
  }

  public getShipmentNo(): string | null {
    return this.decryptedData?.['ShipmentNo'] ?? this.data['ShipmentNo'] ?? null
  }

  public getData(): Record<string, any> {
    return this.data
  }

  public getDecryptedData(): Record<string, any> | null {
    return this.decryptedData
  }

  public get(key: string, defaultValue: any = null): any {
    return this.decryptedData?.[key] ?? this.data[key] ?? defaultValue
  }

  public getSuccessResponse(): string {
    return '1|OK'
  }

  public getFailResponse(message: string = 'Error'): string {
    return `0|${message}`
  }
}
