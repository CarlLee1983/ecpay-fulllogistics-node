import { describe, expect, it, beforeEach } from 'bun:test'
import { UpdateB2COrder } from '../../src/mutations/UpdateB2COrder'
import { ApiMode } from '../../src/parameters/ApiMode'
import { LogisticsException } from '../../src/exceptions/LogisticsException'
import { ScheduledPickupTime } from '../../src/parameters/ScheduledPickupTime'

describe('UpdateB2COrder', () => {
  const config = {
    merchantId: '2000132',
    hashKey: '5294y06JbISpM5x9',
    hashIv: 'v77hoKGq4kWxNNIS',
    mode: ApiMode.Stage,
  }

  let action: UpdateB2COrder

  beforeEach(() => {
    action = new UpdateB2COrder(config)
  })

  it('should set AllPayLogisticsID', () => {
    action.setAllPayLogisticsID('12345')
    expect((action as any).content.Data.AllPayLogisticsID).toBe('12345')
  })

  it('should set PlatformID', () => {
    action.setPlatformID('PF01')
    expect((action as any).content.Data.PlatformID).toBe('PF01')
  })

  it('should set ShipmentNo', () => {
    action.setShipmentNo('SHIP123')
    expect((action as any).content.Data.ShipmentNo).toBe('SHIP123')
  })

  it('should set ShipmentDate', () => {
    action.setShipmentDate('2023/12/31')
    expect((action as any).content.Data.ShipmentDate).toBe('2023/12/31')
  })

  it('should set ReceiverStoreID', () => {
    action.setReceiverStoreID('123456')
    expect((action as any).content.Data.ReceiverStoreID).toBe('123456')
  })

  it('should set ReturnStoreID', () => {
    action.setReturnStoreID('654321')
    expect((action as any).content.Data.ReturnStoreID).toBe('654321')
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

  it('should validate required fields', async () => {
    expect(action.send()).rejects.toThrow(LogisticsException)
  })
})
