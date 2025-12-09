import { BaseAction } from '../core/BaseAction.js'
import { LogisticsException } from '../exceptions/LogisticsException.js'

export class QueryLogisticsOrder extends BaseAction {
  protected requestPath = '/Express/v2/QueryLogisticsTradeInfo'

  public setAllPayLogisticsID(logisticsId: string): this {
    this.content.Data.AllPayLogisticsID = logisticsId
    return this
  }

  public override setPlatformID(id: string): this {
    if (id) {
      this.content.Data.PlatformID = id
    }
    return this
  }

  protected override validate(): void {
    if (!this.content.Data.AllPayLogisticsID) {
      throw LogisticsException.required('AllPayLogisticsID')
    }
  }
}
