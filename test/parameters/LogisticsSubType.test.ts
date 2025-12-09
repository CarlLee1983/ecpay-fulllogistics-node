import { describe, expect, it } from 'bun:test'
import { LogisticsSubType, isC2C } from '../../src/parameters/LogisticsSubType'

describe('LogisticsSubType', () => {
    it('should identify C2C types', () => {
        expect(isC2C(LogisticsSubType.FAMI_C2C)).toBe(true)
        expect(isC2C(LogisticsSubType.UNIMART_C2C)).toBe(true)
        expect(isC2C(LogisticsSubType.HILIFE_C2C)).toBe(true)
        expect(isC2C(LogisticsSubType.OKMART_C2C)).toBe(true)
    })

    it('should identify non-C2C types', () => {
        expect(isC2C(LogisticsSubType.UNIMART)).toBe(false)
        expect(isC2C(LogisticsSubType.FAMI)).toBe(false)
        expect(isC2C(LogisticsSubType.HILIFE)).toBe(false)
        expect(isC2C(LogisticsSubType.TCAT)).toBe(false)
    })
})
