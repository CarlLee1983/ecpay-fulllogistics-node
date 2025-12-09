import { describe, expect, it, beforeEach } from 'bun:test'
import { ReturnHome } from '../../src/reverse/ReturnHome'
import { ApiMode } from '../../src/parameters/ApiMode'
import { LogisticsException } from '../../src/exceptions/LogisticsException'
import { Temperature } from '../../src/parameters/Temperature'
import { Distance } from '../../src/parameters/Distance'
import { Specification } from '../../src/parameters/Specification'
import { ScheduledPickupTime } from '../../src/parameters/ScheduledPickupTime'
import { ScheduledDeliveryTime } from '../../src/parameters/ScheduledDeliveryTime'

describe('ReturnHome', () => {
  const config = {
    merchantId: '2000132',
    hashKey: '5294y06JbISpM5x9',
    hashIv: 'v77hoKGq4kWxNNIS',
    mode: ApiMode.Stage,
  }

  let action: ReturnHome

  beforeEach(() => {
    action = new ReturnHome(config)
  })

  it('should set AllPayLogisticsID', () => {
    action.setAllPayLogisticsID('12345')
    expect((action as any).content.Data.AllPayLogisticsID).toBe('12345')
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

  it('should set SenderZipCode', () => {
    action.setSenderZipCode('100')
    expect((action as any).content.Data.SenderZipCode).toBe('100')
  })

  it('should set SenderAddress', () => {
    action.setSenderAddress('Taipei')
    expect((action as any).content.Data.SenderAddress).toBe('Taipei')
  })

  it('should set ReceiverName', () => {
    action.setReceiverName('Receiver')
    expect((action as any).content.Data.ReceiverName).toBe('Receiver')
  })

  it('should set ReceiverPhone', () => {
    action.setReceiverPhone('0912345678')
    expect((action as any).content.Data.ReceiverPhone).toBe('0912345678')
  })

  it('should set ReceiverCellPhone', () => {
    action.setReceiverCellPhone('0912345678')
    expect((action as any).content.Data.ReceiverCellPhone).toBe('0912345678')
  })

  it('should set ReceiverZipCode', () => {
    action.setReceiverZipCode('200')
    expect((action as any).content.Data.ReceiverZipCode).toBe('200')
  })

  it('should set ReceiverAddress', () => {
    action.setReceiverAddress('New Taipei')
    expect((action as any).content.Data.ReceiverAddress).toBe('New Taipei')
  })

  it('should set Temperature', () => {
    action.setTemperature(Temperature.REFRIGERATION)
    expect((action as any).content.Data.Temperature).toBe(Temperature.REFRIGERATION)
    action.setTemperature(Temperature.FREEZE)
    expect((action as any).content.Data.Temperature).toBe(Temperature.FREEZE)
  })

  it('should set Distance', () => {
    action.setDistance(Distance.SAME)
    expect((action as any).content.Data.Distance).toBe(Distance.SAME)
    action.setDistance(Distance.OTHER)
    expect((action as any).content.Data.Distance).toBe(Distance.OTHER)
  })

  it('should set Specification', () => {
    action.setSpecification(Specification.SIZE_60)
    expect((action as any).content.Data.Specification).toBe(Specification.SIZE_60)
  })

  it('should set ScheduledPickupTime', () => {
    action.setScheduledPickupTime(ScheduledPickupTime.TIME_9_12)
    expect((action as any).content.Data.ScheduledPickupTime).toBe(ScheduledPickupTime.TIME_9_12)
  })

  it('should set ScheduledDeliveryTime', () => {
    action.setScheduledDeliveryTime(ScheduledDeliveryTime.TIME_12_17)
    expect((action as any).content.Data.ScheduledDeliveryTime).toBe(
      ScheduledDeliveryTime.TIME_12_17
    )
  })

  it('should validate required fields', async () => {
    expect(action.send()).rejects.toThrow(LogisticsException)
  })
})
