import { describe, expect, it, beforeEach } from 'bun:test'
import { PrintTradeDocument } from '../../src/printing/PrintTradeDocument'
import { ApiMode } from '../../src/parameters/ApiMode'
import { LogisticsException } from '../../src/exceptions/LogisticsException'

describe('PrintTradeDocument', () => {
    const config = {
        merchantId: '2000132',
        hashKey: '5294y06JbISpM5x9',
        hashIv: 'v77hoKGq4kWxNNIS',
        mode: ApiMode.Stage,
    }

    let action: PrintTradeDocument

    beforeEach(() => {
        action = new PrintTradeDocument(config)
    })

    it('should throw error when calling send()', async () => {
        expect(action.send()).rejects.toThrow('Use generateForm()')
    })

    it('should set AllPayLogisticsID', () => {
        action.setAllPayLogisticsID('12345')
        expect((action as any).logisticsIds).toEqual(['12345'])
    })

    it('should add AllPayLogisticsID', () => {
        action.setAllPayLogisticsID('1')
        action.addAllPayLogisticsID('2')
        expect((action as any).logisticsIds).toEqual(['1', '2'])
    })

    it('should set AllPayLogisticsIDs', () => {
        action.setAllPayLogisticsIDs(['1', '2', '3'])
        expect((action as any).logisticsIds).toEqual(['1', '2', '3'])
    })

    it('should batch set AllPayLogisticsID', () => {
        action.batch(['A', 'B'])
        expect((action as any).logisticsIds).toEqual(['A', 'B'])
    })

    it('should set PlatformID', () => {
        action.setPlatformID('PF001')
        expect((action as any).content.Data.PlatformID).toBe('PF001')
    })

    it('should throw error if AllPayLogisticsID is missing', () => {
        expect(() => action.generateForm()).toThrow(LogisticsException)
    })

    it('should generate form html', () => {
        // Must set AllPayLogisticsID to be valid
        action.setAllPayLogisticsID('12345')
        const html = action.generateForm()
        expect(html).toContain('<form id="_form_ecpay"')
    })
    it('should throw exception if invalid', () => {
        expect(() => action.generateForm()).toThrow(LogisticsException)
    })
})
