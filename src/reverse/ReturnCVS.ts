import { BaseAction } from '../core/BaseAction.js'
import { LogisticsException } from '../exceptions/LogisticsException.js'
import { LogisticsSubType } from '../parameters/LogisticsSubType.js'

export class ReturnCVS extends BaseAction {
  // Default path, will be overridden by setLogisticsSubType
  protected requestPath = ''

  private static readonly GOODS_NAME_MAX_LENGTH = 50
  private static readonly SENDER_NAME_MAX_LENGTH = 10

  /**
   * Set Logistics SubType and update request path
   */
  public setLogisticsSubType(subType: LogisticsSubType): this {
    switch (subType) {
      case LogisticsSubType.UNIMART:
        this.requestPath = '/Express/v2/ReturnUnimart'
        break
      case LogisticsSubType.FAMI:
        this.requestPath = '/Express/v2/ReturnFami'
        break
      case LogisticsSubType.HILIFE:
        this.requestPath = '/Express/v2/ReturnHiLife'
        break
      default:
        throw LogisticsException.invalid('LogisticsSubType', 'Unsupported subtype for ReturnCVS')
    }
    return this
  }

  public setAllPayLogisticsID(logisticsId: string): this {
    this.content.Data.AllPayLogisticsID = logisticsId
    return this
  }

  public setReturnStoreID(storeId: string): this {
    this.content.Data.ReturnStoreID = storeId
    return this
  }

  public setGoodsAmount(amount: number): this {
    if (amount < 0) {
      throw LogisticsException.invalid('GoodsAmount', '金額不可為負數')
    }
    this.content.Data.GoodsAmount = amount
    return this
  }

  public setCollectionAmount(amount: number): this {
    if (amount < 0) {
      throw LogisticsException.invalid('CollectionAmount', '金額不可為負數')
    }
    this.content.Data.CollectionAmount = amount
    return this
  }

  public setGoodsName(name: string): this {
    if (name.length > ReturnCVS.GOODS_NAME_MAX_LENGTH) {
      throw LogisticsException.tooLong('GoodsName', ReturnCVS.GOODS_NAME_MAX_LENGTH)
    }
    this.content.Data.GoodsName = name
    return this
  }

  public setServiceType(serviceType: string): this {
    this.content.Data.ServiceType = serviceType
    return this
  }

  public setSenderName(name: string): this {
    if (name.length > ReturnCVS.SENDER_NAME_MAX_LENGTH) {
      throw LogisticsException.tooLong('SenderName', ReturnCVS.SENDER_NAME_MAX_LENGTH)
    }
    this.content.Data.SenderName = name
    return this
  }

  public setSenderPhone(phone: string): this {
    this.content.Data.SenderPhone = phone
    return this
  }

  public setSenderCellPhone(cellPhone: string): this {
    this.content.Data.SenderCellPhone = cellPhone
    return this
  }

  protected override validate(): void {
    if (!this.requestPath) {
      throw new Error('Please setLogisticsSubType() to determine the request path')
    }
    if (!this.content.Data.AllPayLogisticsID) {
      throw LogisticsException.required('AllPayLogisticsID')
    }
    if (!this.content.Data.ServerReplyURL) {
      throw LogisticsException.required('ServerReplyURL')
    }
  }
}
