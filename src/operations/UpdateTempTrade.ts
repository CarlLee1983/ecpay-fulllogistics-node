import { BaseAction } from '../core/BaseAction.js'
import { LogisticsException } from '../exceptions/LogisticsException.js'
import type { Distance } from '../parameters/Distance.js'
import type { ScheduledDeliveryTime } from '../parameters/ScheduledDeliveryTime.js'
import type { ScheduledPickupTime } from '../parameters/ScheduledPickupTime.js'
import type { Specification } from '../parameters/Specification.js'
import type { Temperature } from '../parameters/Temperature.js'

import { IsCollection } from '../parameters/IsCollection.js'

export class UpdateTempTrade extends BaseAction {
  protected requestPath = '/Express/v2/UpdateTempTrade'

  private static readonly GOODS_NAME_MAX_LENGTH = 50
  private static readonly SENDER_NAME_MAX_LENGTH = 10
  private static readonly RECEIVER_NAME_MAX_LENGTH = 10

  public setTempLogisticsID(tempLogisticsId: string): this {
    this.content.Data.TempLogisticsID = tempLogisticsId
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

  public setIsCollection(isCollection: IsCollection | string): this {
    this.content.Data.IsCollection = isCollection
    return this
  }

  public setGoodsName(name: string): this {
    if (name.length > UpdateTempTrade.GOODS_NAME_MAX_LENGTH) {
      throw LogisticsException.tooLong('GoodsName', UpdateTempTrade.GOODS_NAME_MAX_LENGTH)
    }
    this.content.Data.GoodsName = name
    return this
  }

  public setSenderName(name: string): this {
    if (name.length > UpdateTempTrade.SENDER_NAME_MAX_LENGTH) {
      throw LogisticsException.tooLong('SenderName', UpdateTempTrade.SENDER_NAME_MAX_LENGTH)
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

  public setSenderZipCode(zipCode: string): this {
    this.content.Data.SenderZipCode = zipCode
    return this
  }

  public setSenderAddress(address: string): this {
    this.content.Data.SenderAddress = address
    return this
  }

  public setReceiverName(name: string): this {
    if (name.length > UpdateTempTrade.RECEIVER_NAME_MAX_LENGTH) {
      throw LogisticsException.tooLong('ReceiverName', UpdateTempTrade.RECEIVER_NAME_MAX_LENGTH)
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

  public setReceiverZipCode(zipCode: string): this {
    this.content.Data.ReceiverZipCode = zipCode
    return this
  }

  public setReceiverAddress(address: string): this {
    this.content.Data.ReceiverAddress = address
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

  public setTemperature(temperature: Temperature): this {
    this.content.Data.Temperature = temperature
    return this
  }

  public setDistance(distance: Distance): this {
    this.content.Data.Distance = distance
    return this
  }

  public setSpecification(specification: Specification): this {
    this.content.Data.Specification = specification
    return this
  }

  public setScheduledPickupTime(time: ScheduledPickupTime): this {
    this.content.Data.ScheduledPickupTime = time
    return this
  }

  public setScheduledDeliveryTime(time: ScheduledDeliveryTime): this {
    this.content.Data.ScheduledDeliveryTime = time
    return this
  }

  protected override validate(): void {
    if (!this.content.Data.TempLogisticsID) {
      throw LogisticsException.required('TempLogisticsID')
    }
  }
}
