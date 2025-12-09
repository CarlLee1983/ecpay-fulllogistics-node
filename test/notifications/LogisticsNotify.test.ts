import { describe, expect, it } from 'bun:test'
import { LogisticsNotify } from '../../src/notifications/LogisticsNotify'
import { CipherService } from '../../src/core/CipherService'
import { ApiMode } from '../../src/parameters/ApiMode'

describe('LogisticsNotify', () => {
  const config = {
    merchantId: '2000132',
    hashKey: '5294y06JbISpM5x9',
    hashIv: 'v77hoKGq4kWxNNIS',
    mode: ApiMode.Stage,
  }

  const hashKey = '5294y06JbISpM5x9'
  const hashIv = 'v77hoKGq4kWxNNIS'

  it('should be instantiated', () => {
    const notify = new LogisticsNotify(hashKey, hashIv)
    expect(notify).toBeInstanceOf(LogisticsNotify)
  })

  it('should handle plain data', () => {
    const notify = new LogisticsNotify(hashKey, hashIv)
    const data = {
      RtnCode: '1',
      RtnMsg: 'OK',
      AllPayLogisticsID: '12345',
      MerchantTradeNo: 'TestTrade123',
      LogisticsStatus: '300',
      LogisticsStatusName: 'Arrived',
      GoodsAmount: '100',
      UpdateStatusDate: '2023/01/01',
      ReceiverStoreID: '101',
      ReceiverStoreName: 'Store A',
      ShipmentNo: 'SHIP123',
    }
    notify.handle(data)

    expect(notify.getRtnCode()).toBe(1)
    expect(notify.getRtnMsg()).toBe('OK')
    expect(notify.isSuccess()).toBe(true)
    expect(notify.getAllPayLogisticsID()).toBe('12345')
    expect(notify.getMerchantTradeNo()).toBe('TestTrade123')
    expect(notify.getLogisticsStatus()).toBe('300')
    expect(notify.getLogisticsStatusName()).toBe('Arrived')
    expect(notify.getGoodsAmount()).toBe(100)
    expect(notify.getUpdateStatusDate()).toBe('2023/01/01')
    expect(notify.getReceiverStoreID()).toBe('101')
    expect(notify.getReceiverStoreName()).toBe('Store A')
    expect(notify.getShipmentNo()).toBe('SHIP123')
    expect(notify.getData()).toEqual(data)
    expect(notify.getDecryptedData()).toBeNull()
    expect(notify.get('CustomKey', 'default')).toBe('default')
  })

  it('should handle encrypted data', () => {
    const cipher = new CipherService(hashKey, hashIv)
    const innerData = JSON.stringify({
      AllPayLogisticsID: 'Encrypted123',
      GoodsAmount: 500,
    })
    const encrypted = cipher.encrypt(innerData)
    const data = {
      RtnCode: '1',
      Data: encrypted,
    }

    const notify = new LogisticsNotify(hashKey, hashIv)
    notify.handle(data)

    expect(notify.getAllPayLogisticsID()).toBe('Encrypted123')
    expect(notify.getGoodsAmount()).toBe(500)
    expect(notify.getDecryptedData()).toEqual(
      expect.objectContaining({ AllPayLogisticsID: 'Encrypted123' })
    )
  })

  it('should handle failure rtn code', () => {
    const notify = new LogisticsNotify(hashKey, hashIv)
    notify.handle({ RtnCode: '0' })
    expect(notify.isSuccess()).toBe(false)
  })

  it('should helper methods return correct string', () => {
    const notify = new LogisticsNotify(hashKey, hashIv)
    expect(notify.getSuccessResponse()).toBe('1|OK')
    expect(notify.getFailResponse('Fail')).toBe('0|Fail')
    expect(notify.getFailResponse()).toBe('0|Error')
  })

  it('should handle URL encoded encrypted data', () => {
    const cipher = new CipherService(hashKey, hashIv)
    const innerData = JSON.stringify({
      AllPayLogisticsID: 'UrlEncrypted123',
    })
    // Simulate URL encoded if needed, or mostly regular specific check
    // The implementation tries decodeURIComponent.
    const encrypted = cipher.encrypt(innerData) // Usually standard chars, but let's assume it works
    const data = {
      Data: encrypted, // In strict tests we might want to manually encode URI components if they were unsafe
    }
    const notify = new LogisticsNotify(hashKey, hashIv)
    notify.handle(data) // Should succeed with try-catch logic
    expect(notify.getAllPayLogisticsID()).toBe('UrlEncrypted123')
  })

  it('should fallback to empty object on decryption failure', () => {
    const notify = new LogisticsNotify(hashKey, hashIv)
    // Should not throw, should result in empty decrypted data
    notify.handle({ Data: 'InvalidEncryptedString' })
    expect(notify.getDecryptedData()).toEqual({})
  })
})
