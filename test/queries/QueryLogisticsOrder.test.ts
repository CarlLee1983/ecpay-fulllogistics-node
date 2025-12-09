import { describe, expect, it, beforeEach } from 'bun:test'
import { QueryLogisticsOrder } from '../../src/queries/QueryLogisticsOrder'
import { ApiMode } from '../../src/parameters/ApiMode'
import { LogisticsException } from '../../src/exceptions/LogisticsException'

describe('QueryLogisticsOrder', () => {
  const config = {
    merchantId: '2000132',
    hashKey: '5294y06JbISpM5x9',
    hashIv: 'v77hoKGq4kWxNNIS',
    mode: ApiMode.Stage,
  }

  let action: QueryLogisticsOrder

  beforeEach(() => {
    action = new QueryLogisticsOrder(config)
  })

  it('should set AllPayLogisticsID', () => {
    action.setAllPayLogisticsID('12345')
    expect((action as any).content.Data.AllPayLogisticsID).toBe('12345')
  })

  it('should set PlatformID', () => {
    action.setPlatformID('PF001')
    expect((action as any).content.Data.PlatformID).toBe('PF001')
  })

  it('should validate required fields', async () => {
    expect(action.send()).rejects.toThrow(LogisticsException)
  })
})
