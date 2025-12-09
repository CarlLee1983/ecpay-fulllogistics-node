import { BaseAction } from '../core/BaseAction.js'
import { LogisticsException } from '../exceptions/LogisticsException.js'
import { LogisticsType } from '../parameters/LogisticsType.js'
import { LogisticsSubType } from '../parameters/LogisticsSubType.js'

export class OpenLogisticsSelection extends BaseAction {
  // This operation is a form post, not JSON API.
  // We need to generate HTML form or return form data.
  // PHP SDK returns an HTML form string.

  protected requestPath = '/Express/v2/RedirectToLogisticsSelection'

  constructor(config: any) {
    super(config)
    this.content.Data.LogisticsType = LogisticsType.CVS
    this.content.Data.LogisticsSubType = LogisticsSubType.UNIMART
  }

  public setLogisticsType(type: LogisticsType): this {
    this.content.Data.LogisticsType = type
    return this
  }

  public setLogisticsSubType(subType: LogisticsSubType): this {
    this.content.Data.LogisticsSubType = subType
    // Unlike CreateOrder, here we just set what user asks, but usually it's just CVS/Home or specific.
    return this
  }

  public setGoodsAmount(amount: number): this {
    if (amount < 0) {
      throw LogisticsException.invalid('GoodsAmount', '金額不可為負數')
    }
    this.content.Data.GoodsAmount = amount
    return this
  }

  public setGoodsName(name: string): this {
    this.content.Data.GoodsName = name
    return this
  }

  public setSenderName(name: string): this {
    this.content.Data.SenderName = name
    return this
  }

  public override setClientReplyURL(url: string): this {
    this.content.Data.ClientReplyURL = url
    return this
  }

  /**
   * Generate HTML Form for redirection
   */
  public generateForm(): string {
    this.validate()

    // Update Timestamp if not set
    this.content.RqHeader.Timestamp = Math.floor(Date.now() / 1000)

    const payload = this.encoder.encode(
      this.config.merchantId,
      this.content.Data,
      this.content.RqHeader
    )

    const apiUrl = this.getApiUrl() + this.requestPath

    // Create a hidden form and submit it
    return `
        <form id="_ecpay_logistics_form" action="${apiUrl}" method="post">
            <input type="hidden" name="MerchantID" value="${payload.MerchantID}" />
            <input type="hidden" name="RqHeader" value='${JSON.stringify(payload.RqHeader)}' />
            <input type="hidden" name="Data" value="${payload.Data}" />
            <script type="text/javascript">document.getElementById("_ecpay_logistics_form").submit();</script>
        </form>
      `
  }

  /**
   * Override send to throw error because this is form post action
   */
  public override async send(): Promise<any> {
    throw new Error('Use generateForm() for OpenLogisticsSelection')
  }

  protected override validate(): void {
    if (!this.content.Data.ServerReplyURL) {
      throw LogisticsException.required('ServerReplyURL')
    }
    // other validations if needed
  }
}
