import { BaseAction } from '../core/BaseAction.js'
import { LogisticsException } from '../exceptions/LogisticsException.js'

export class UpdateB2COrder extends BaseAction {
  protected requestPath = '/Express/v2/UpdateShipmentInfo'

  private static readonly RECEIVER_NAME_MAX_LENGTH = 10

  public setAllPayLogisticsID(logisticsId: string): this {
    this.content.Data.AllPayLogisticsID = logisticsId
    return this
  }

  public setShipmentNo(shipmentNo: string): this {
    this.content.Data.ShipmentNo = shipmentNo
    return this
  }

  public setShipmentDate(date: string): this {
    this.content.Data.ShipmentDate = date
    return this
  }

  public setReceiverStoreID(storeId: string): this {
    this.content.Data.ReceiverStoreID = storeId
    return this
  }

  public setReturnStoreID(storeId: string): this {
    this.content.Data.ReturnStoreID = storeId
    return this
  }

  public setReceiverName(name: string): this {
    if (name.length > UpdateB2COrder.RECEIVER_NAME_MAX_LENGTH) {
      throw LogisticsException.tooLong('ReceiverName', UpdateB2COrder.RECEIVER_NAME_MAX_LENGTH)
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
  }
}
