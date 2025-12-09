import { describe, expect, it, beforeEach } from 'bun:test'
import { ReturnCVS } from '../../src/reverse/ReturnCVS'
import { ApiMode } from '../../src/parameters/ApiMode'
import { LogisticsSubType } from '../../src/parameters/LogisticsSubType'
import { LogisticsException } from '../../src/exceptions/LogisticsException'

describe('ReturnCVS', () => {
  const config = {
    merchantId: '2000132',
    hashKey: '5294y06JbISpM5x9',
    hashIv: 'v77hoKGq4kWxNNIS',
    mode: ApiMode.Stage,
  }

  let action: ReturnCVS

  beforeEach(() => {
    action = new ReturnCVS(config)
  })

  it('should set AllPayLogisticsID', () => {
    action.setAllPayLogisticsID('12345')
    expect((action as any).content.Data.AllPayLogisticsID).toBe('12345')
  })

  it('should set LogisticsSubType', () => {
    action.setLogisticsSubType(LogisticsSubType.UNIMART)
    expect((action as any).requestPath).toBe('/Express/v2/ReturnUnimart')
  })

  it('should set GoodsAmount', () => {
    action.setGoodsAmount(100)
    expect((action as any).content.Data.GoodsAmount).toBe(100)
  })

  it('should throw exception for negative GoodsAmount', () => {
    expect(() => action.setGoodsAmount(-1)).toThrow(LogisticsException)
  })

  it('should set CollectionAmount', () => {
    action.setCollectionAmount(200)
    expect((action as any).content.Data.CollectionAmount).toBe(200)
  })

  it('should throw exception for negative CollectionAmount', () => {
    expect(() => action.setCollectionAmount(-1)).toThrow(LogisticsException)
  })

  it('should set ServiceType', () => {
    action.setServiceType('C2C')
    expect((action as any).content.Data.ServiceType).toBe('C2C')
  })

  it('should set GoodsName', () => {
    action.setGoodsName('Goods')
    expect((action as any).content.Data.GoodsName).toBe('Goods')
  })

  it('should set SenderName', () => {
    action.setSenderName('Sender')
    expect((action as any).content.Data.SenderName).toBe('Sender')
  })

  it('should set SenderPhone', () => {
    action.setSenderPhone('0912345678')
    expect((action as any).content.Data.SenderPhone).toBe('0912345678')
  })

  it('should set SenderCellPhone', () => {
    action.setSenderCellPhone('0912345678')
    expect((action as any).content.Data.SenderCellPhone).toBe('0912345678')
  })

  it('should set ReturnStoreID', () => {
    action.setReturnStoreID('654321')
    expect((action as any).content.Data.ReturnStoreID).toBe('654321')
  })

  it('should validate required fields', async () => {
    expect(action.send()).rejects.toThrow()
  })
})
