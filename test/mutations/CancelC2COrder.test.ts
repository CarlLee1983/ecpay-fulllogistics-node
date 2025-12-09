import { describe, expect, it, beforeEach } from 'bun:test'
import { CancelC2COrder } from '../../src/mutations/CancelC2COrder'
import { ApiMode } from '../../src/parameters/ApiMode'
import { LogisticsException } from '../../src/exceptions/LogisticsException'
import { LogisticsSubType } from '../../src/parameters/LogisticsSubType'

describe('CancelC2COrder', () => {
  const config = {
    merchantId: '2000132',
    hashKey: '5294y06JbISpM5x9',
    hashIv: 'v77hoKGq4kWxNNIS',
    mode: ApiMode.Stage,
  }

  let action: CancelC2COrder

  beforeEach(() => {
    action = new CancelC2COrder(config)
  })

  it('should set AllPayLogisticsID', () => {
    action.setAllPayLogisticsID('12345')
    expect((action as any).content.Data.AllPayLogisticsID).toBe('12345')
  })

  it('should set LogisticsSubType', () => {
    action.setLogisticsSubType(LogisticsSubType.UNIMART_C2C)
    expect((action as any).content.Data.LogisticsSubType).toBe(LogisticsSubType.UNIMART_C2C)
  })

  it('should throw exception for non-C2C LogisticsSubType', () => {
    expect(() => action.setLogisticsSubType(LogisticsSubType.UNIMART)).toThrow(LogisticsException)
  })

  it('should set CVSValidationNo', () => {
    action.setCVSValidationNo('1234')
    expect((action as any).content.Data.CVSValidationNo).toBe('1234')
  })

  it('should validate required fields', async () => {
    expect(action.send()).rejects.toThrow(LogisticsException)
  })
})
