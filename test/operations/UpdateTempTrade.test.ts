import { describe, expect, it, beforeEach } from 'bun:test'
import { UpdateTempTrade } from '../../src/operations/UpdateTempTrade'
import { ApiMode } from '../../src/parameters/ApiMode'
import { LogisticsException } from '../../src/exceptions/LogisticsException'
import { IsCollection } from '../../src/parameters/IsCollection'
import { Temperature } from '../../src/parameters/Temperature'
import { Distance } from '../../src/parameters/Distance'
import { Specification } from '../../src/parameters/Specification'
import { ScheduledPickupTime } from '../../src/parameters/ScheduledPickupTime'
import { ScheduledDeliveryTime } from '../../src/parameters/ScheduledDeliveryTime'

describe('UpdateTempTrade', () => {
  const config = {
    merchantId: '2000132',
    hashKey: '5294y06JbISpM5x9',
    hashIv: 'v77hoKGq4kWxNNIS',
    mode: ApiMode.Stage,
  }

  let action: UpdateTempTrade

  beforeEach(() => {
    action = new UpdateTempTrade(config)
  })

  it('should set TempLogisticsID', () => {
    action.setTempLogisticsID('12345')
    expect((action as any).content.Data.TempLogisticsID).toBe('12345')
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

  it('should set IsCollection', () => {
    action.setIsCollection(IsCollection.YES)
    expect((action as any).content.Data.IsCollection).toBe(IsCollection.YES)
  })

  it('should set GoodsName', () => {
    action.setGoodsName('Test Goods')
    expect((action as any).content.Data.GoodsName).toBe('Test Goods')
  })

  it('should set SenderName', () => {
    action.setSenderName('Sender')
    expect((action as any).content.Data.SenderName).toBe('Sender')
  })

  it('should set SenderPhone', () => {
    action.setSenderPhone('021234567')
    expect((action as any).content.Data.SenderPhone).toBe('021234567')
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
    action.setSenderAddress('Address')
    expect((action as any).content.Data.SenderAddress).toBe('Address')
  })

  it('should set ReceiverName', () => {
    action.setReceiverName('Receiver')
    expect((action as any).content.Data.ReceiverName).toBe('Receiver')
  })

  it('should set ReceiverPhone', () => {
    action.setReceiverPhone('028765432')
    expect((action as any).content.Data.ReceiverPhone).toBe('028765432')
  })

  it('should set ReceiverCellPhone', () => {
    action.setReceiverCellPhone('0987654321')
    expect((action as any).content.Data.ReceiverCellPhone).toBe('0987654321')
  })

  it('should set ReceiverZipCode', () => {
    action.setReceiverZipCode('200')
    expect((action as any).content.Data.ReceiverZipCode).toBe('200')
  })

  it('should set ReceiverAddress', () => {
    action.setReceiverAddress('Receiver Address')
    expect((action as any).content.Data.ReceiverAddress).toBe('Receiver Address')
  })

  it('should set ReceiverStoreID', () => {
    action.setReceiverStoreID('ST123')
    expect((action as any).content.Data.ReceiverStoreID).toBe('ST123')
  })

  it('should set ReturnStoreID', () => {
    action.setReturnStoreID('RT123')
    expect((action as any).content.Data.ReturnStoreID).toBe('RT123')
  })

  it('should set Temperature', () => {
    action.setTemperature(Temperature.REFRIGERATION)
    expect((action as any).content.Data.Temperature).toBe(Temperature.REFRIGERATION)
  })

  it('should set Distance', () => {
    action.setDistance(Distance.SAME)
    expect((action as any).content.Data.Distance).toBe(Distance.SAME)
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
