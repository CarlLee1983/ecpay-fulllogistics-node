import { BaseAction } from '../core/BaseAction.js'
import { LogisticsException } from '../exceptions/LogisticsException.js'
import { LogisticsSubType, isC2C } from '../parameters/LogisticsSubType.js'

export class UpdateC2COrder extends BaseAction {
  protected requestPath = '/Express/v2/UpdateStoreInfo'

  private static readonly RECEIVER_NAME_MAX_LENGTH = 10

  public setAllPayLogisticsID(logisticsId: string): this {
    this.content.Data.AllPayLogisticsID = logisticsId
    return this
  }

  public setLogisticsSubType(subType: LogisticsSubType): this {
    if (!isC2C(subType)) {
      throw LogisticsException.invalid('LogisticsSubType', '必須為 C2C 類型')
    }
    this.content.Data.LogisticsSubType = subType
    return this
  }

  public setCVSValidationNo(validationNo: string): this {
    this.content.Data.CVSValidationNo = validationNo
    return this
  }

  public setReceiverStoreID(storeId: string): this {
    this.content.Data.ReceiverStoreID = storeId
    return this
  }

  public setReceiverName(name: string): this {
    if (name.length > UpdateC2COrder.RECEIVER_NAME_MAX_LENGTH) {
      throw LogisticsException.tooLong('ReceiverName', UpdateC2COrder.RECEIVER_NAME_MAX_LENGTH)
    }
    this.content.Data.ReceiverName = name
    return this
  }

  public setReceiverPhone(phone: string): this {
    this.content.Data.ReceiverPhone = phone
    return this
  }

  public setReceiverCellPhone(cellPhone: string): this {
    this.content.Data.ReceiverCellPhone = cellPhone
    return this
  }

  protected override validate(): void {
    if (!this.content.Data.AllPayLogisticsID) {
      throw LogisticsException.required('AllPayLogisticsID')
    }
    if (!this.content.Data.LogisticsSubType) {
      throw LogisticsException.required('LogisticsSubType')
    }
    if (!this.content.Data.CVSValidationNo) {
      throw LogisticsException.required('CVSValidationNo')
    }
    if (!this.content.Data.ReceiverStoreID) {
      throw LogisticsException.required('ReceiverStoreID')
    }
  }
}
