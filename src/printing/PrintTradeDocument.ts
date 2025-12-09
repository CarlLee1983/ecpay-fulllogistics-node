import { BaseAction } from '../core/BaseAction.js'
import { LogisticsException } from '../exceptions/LogisticsException.js'
import type { EcPayConfig } from '../types/EcPayConfig.js'

export class PrintTradeDocument extends BaseAction {
  protected requestPath = '/Express/v2/PrintTradeDocument'
  private logisticsIds: string[] = []

  constructor(config: EcPayConfig) {
    super(config)
  }

  /**
   * Set AllPayLogisticsID (Single)
   */
  public setAllPayLogisticsID(logisticsId: string): this {
    this.logisticsIds = [logisticsId]
    return this
  }

  /**
   * Add AllPayLogisticsID (Batch)
   */
  public addAllPayLogisticsID(logisticsId: string): this {
    this.logisticsIds.push(logisticsId)
    return this
  }

  /**
   * Set AllPayLogisticsIDs (Batch)
   */
  public setAllPayLogisticsIDs(logisticsIds: string[]): this {
    this.logisticsIds = logisticsIds
    return this
  }

  /**
   * Batch method alias
   */
  public batch(logisticsIds: string[]): this {
    return this.setAllPayLogisticsIDs(logisticsIds)
  }

  /**
   * Override send to throw error because this is form post action (Opening print page)
   * Wait, PHP SDK says "產生託運單列印頁面網址". It might return HTML or URL.
   * Looking at PHP `getPayload`, it seems to just prepare data.
   * The PHP SDK usage usually involves generating a form.
   * Let's check OpenLogisticsSelection.ts implementation.
   * Actually PrintTradeDocument often behaves like OpenLogisticsSelection (Redirect) OR returns HTML.
   * PHP Doc says: "產生託運單列印頁面網址".
   * Let's assume it should behave like OpenLogisticsSelection: generateForm().
   */
  public override async send(): Promise<any> {
    throw new Error('Use generateForm() for PrintTradeDocument')
  }

  protected override validate(): void {
    if (this.logisticsIds.length === 0) {
      throw LogisticsException.required('AllPayLogisticsID')
    }
    // Set the comma-separated string to Data before generating form
    this.content.Data.AllPayLogisticsID = this.logisticsIds.join(',')
  }

  /**
   * Generates the HTML form to redirect to ECPay
   */
  public generateForm(): string {
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

    return `
      <form id="_form_ecpay" action="${apiUrl}" method="post">
        <input type="hidden" name="MerchantID" value="${payload.MerchantID}" />
        <input type="hidden" name="RqHeader" value='${JSON.stringify(payload.RqHeader)}' />
        <input type="hidden" name="Data" value="${payload.Data}" />
      </form>
      <script type="text/javascript">document.getElementById("_form_ecpay").submit();</script>
    `
  }
}
