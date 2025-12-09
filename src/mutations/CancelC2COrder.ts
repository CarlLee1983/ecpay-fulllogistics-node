import { BaseAction } from '../core/BaseAction.js'
import { LogisticsException } from '../exceptions/LogisticsException.js'
import { LogisticsSubType, isC2C } from '../parameters/LogisticsSubType.js'

export class CancelC2COrder extends BaseAction {
  protected requestPath = '/Express/v2/CancelC2COrder'

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
  }
}
