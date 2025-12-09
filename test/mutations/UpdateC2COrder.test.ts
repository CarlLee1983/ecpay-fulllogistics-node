import { describe, expect, it, beforeEach } from 'bun:test'
import { UpdateC2COrder } from '../../src/mutations/UpdateC2COrder'
import { LogisticsException } from '../../src/exceptions/LogisticsException'
import { ApiMode } from '../../src/parameters/ApiMode'
import { LogisticsSubType } from '../../src/parameters/LogisticsSubType'

describe('UpdateC2COrder', () => {
  const config = {
    merchantId: '2000132',
    hashKey: '5294y06JbISpM5x9',
    hashIv: 'v77hoKGq4kWxNNIS',
    mode: ApiMode.Stage,
  }

  let action: UpdateC2COrder

  beforeEach(() => {
    action = new UpdateC2COrder(config)
  })

  it('should set PlatformID', () => {
    action.setPlatformID('PF01')
    expect((action as any).content.Data.PlatformID).toBe('PF01')
  })

  it('should set ReceiverStoreID', () => {
    action.setReceiverStoreID('123456')
    expect((action as any).content.Data.ReceiverStoreID).toBe('123456')
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

  it('should set ReceiverName', () => {
    action.setReceiverName('Receiver')
    expect((action as any).content.Data.ReceiverName).toBe('Receiver')
  })

  it('should set ReceiverPhone', () => {
    action.setReceiverPhone('021234567')
    expect((action as any).content.Data.ReceiverPhone).toBe('021234567')
  })

  it('should set ReceiverCellPhone', () => {
    action.setReceiverCellPhone('0912345678')
    expect((action as any).content.Data.ReceiverCellPhone).toBe('0912345678')
  })

  it('should set AllPayLogisticsID', () => {
    action.setAllPayLogisticsID('12345')
    expect((action as any).content.Data.AllPayLogisticsID).toBe('12345')
  })

  it('should set AllPayLogisticsID', () => {
    action.setAllPayLogisticsID('12345')
    expect((action as any).content.Data.AllPayLogisticsID).toBe('12345')
  })

  it('should validate required fields', async () => {
    expect(action.send()).rejects.toThrow(LogisticsException)
  })
})
