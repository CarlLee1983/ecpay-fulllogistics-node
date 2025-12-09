import { describe, expect, it, beforeEach } from 'bun:test'
import { OpenLogisticsSelection } from '../../src/operations/OpenLogisticsSelection'
import { ApiMode } from '../../src/parameters/ApiMode'
import { LogisticsType } from '../../src/parameters/LogisticsType'
import { LogisticsSubType } from '../../src/parameters/LogisticsSubType'
import { LogisticsException } from '../../src/exceptions/LogisticsException'

describe('OpenLogisticsSelection', () => {
    const config = {
        merchantId: '2000132',
        hashKey: '5294y06JbISpM5x9',
        hashIv: 'v77hoKGq4kWxNNIS',
        mode: ApiMode.Stage,
    }

    let action: OpenLogisticsSelection

    beforeEach(() => {
        action = new OpenLogisticsSelection(config)
    })

    it('should defaulted to CVS UNIMART', () => {
        // access private/protected via any
        expect((action as any).content.Data.LogisticsType).toBe(LogisticsType.CVS)
        expect((action as any).content.Data.LogisticsSubType).toBe(LogisticsSubType.UNIMART)
    })

    it('should set logistics type', () => {
        action.setLogisticsType(LogisticsType.HOME)
        expect((action as any).content.Data.LogisticsType).toBe(LogisticsType.HOME)
    })

    it('should set logistics sub type', () => {
        action.setLogisticsSubType(LogisticsSubType.TCAT)
        expect((action as any).content.Data.LogisticsSubType).toBe(LogisticsSubType.TCAT)
    })

    it('should set GoodsAmount', () => {
        action.setGoodsAmount(1000)
        expect((action as any).content.Data.GoodsAmount).toBe(1000)
    })

    it('should throw exception for negative GoodsAmount', () => {
        expect(() => action.setGoodsAmount(-1)).toThrow(LogisticsException)
    })

    it('should set GoodsName', () => {
        action.setGoodsName('Test Goods')
        expect((action as any).content.Data.GoodsName).toBe('Test Goods')
    })

    it('should set SenderName', () => {
        action.setSenderName('Sender')
        expect((action as any).content.Data.SenderName).toBe('Sender')
    })

    it('should set ClientReplyURL', () => {
        action.setClientReplyURL('https://client.com/reply')
        expect((action as any).content.Data.ClientReplyURL).toBe('https://client.com/reply')
    })

    it('should throw error when calling send()', async () => {
        expect(action.send()).rejects.toThrow('Use generateForm()')
    })

    it('should generate form html', () => {
        action.setServerReplyURL('https://example.com/server') // Required
        // We also need to set client reply url if we want to follow basic flow, though strictly not required by SDK type definition (but API needs it?)
        // Check validate() rules

        const form = action.generateForm()
        expect(form).toContain('<form id="_ecpay_logistics_form"')
        expect(form).toContain('action="https://logistics-stage.ecpay.com.tw/Express/v2/RedirectToLogisticsSelection"')
        expect(form).toContain('name="MerchantID"')
        expect(form).toContain('name="RqHeader"')
        expect(form).toContain('name="Data"')
    })

    it('should throw validation error if ServerReplyURL missing', () => {
        expect(() => action.generateForm()).toThrow(LogisticsException)
    })
})
