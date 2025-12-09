import { describe, expect, it, mock, beforeEach, afterEach } from 'bun:test'
import { BaseAction } from '../../src/core/BaseAction'
import { ApiMode } from '../../src/parameters/ApiMode'
import { LogisticsException } from '../../src/exceptions/LogisticsException'

// Concrete implementation for testing abstract class
class TestAction extends BaseAction {
  protected requestPath = '/test/path'

  public override validate(): void {
    if (!this.content.MerchantID) {
      throw new Error('MerchantID is required')
    }
  }

  // Helper to access protected content
  public getContent() {
    return this.content
  }
}

describe('BaseAction', () => {
  const config = {
    merchantId: '2000132',
    hashKey: '5294y06JbISpM5x9',
    hashIv: 'v77hoKGq4kWxNNIS',
    mode: ApiMode.Stage,
  }

  let action: TestAction

  beforeEach(() => {
    action = new TestAction(config)
  })

  describe('constructor', () => {
    it('should initialize with config', () => {
      expect(action.getContent().MerchantID).toBe(config.merchantId)
      expect(action.getContent().Data.MerchantID).toBe(config.merchantId)
    })
  })

  describe('setMerchantTradeNo', () => {
    it('should set merchant trade no', () => {
      action.setMerchantTradeNo('TRADE12345')
      expect(action.getContent().Data.MerchantTradeNo).toBe('TRADE12345')
    })

    it('should throw error if too long', () => {
      const longId = 'A'.repeat(21)
      expect(() => action.setMerchantTradeNo(longId)).toThrow(LogisticsException)
    })
  })

  describe('setMerchantTradeDate', () => {
    it('should set date from string', () => {
      action.setMerchantTradeDate('2023/01/01 12:00:00')
      expect(action.getContent().Data.MerchantTradeDate).toBe('2023/01/01 12:00:00')
    })

    it('should set date from Date object', () => {
      const date = new Date('2023-01-01T12:00:00')
      action.setMerchantTradeDate(date)
      // Expect default formatting YYYY/MM/DD HH:mm:ss
      // Note: This matches local time, might depend on timezone in env
      expect(action.getContent().Data.MerchantTradeDate).toMatch(
        /\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}/
      )
    })
  })

  describe('setServerReplyURL', () => {
    it('should set server reply url', () => {
      action.setServerReplyURL('https://example.com/reply')
      expect(action.getContent().Data.ServerReplyURL).toBe('https://example.com/reply')
    })
  })

  describe('setClientReplyURL', () => {
    it('should set client reply url', () => {
      action.setClientReplyURL('https://example.com/client')
      expect(action.getContent().Data.ClientReplyURL).toBe('https://example.com/client')
    })
  })

  describe('setPlatformID', () => {
    it('should set platform id', () => {
      action.setPlatformID('PF123')
      expect(action.getContent().Data.PlatformID).toBe('PF123')
    })

    it('should ignore empty string', () => {
      action.setPlatformID('')
      expect(action.getContent().Data.PlatformID).toBeUndefined()
    })
  })

  describe('setRemark', () => {
    it('should set remark', () => {
      action.setRemark('test remark')
      expect(action.getContent().Data.Remark).toBe('test remark')
    })
  })

  describe('getApiUrl', () => {
    it('should return staging url', () => {
      // Access protected method via any cast
      expect((action as any).getApiUrl()).toBe('https://logistics-stage.ecpay.com.tw')
    })

    it('should return production url', () => {
      const prodAction = new TestAction({ ...config, mode: ApiMode.Production })
      expect((prodAction as any).getApiUrl()).toBe('https://logistics.ecpay.com.tw')
    })
  })

  describe('send', () => {
    it('should fetch and return response', async () => {
      const mockResponse = {
        TransCode: '1',
        TransMsg: 'Success',
        Data: 'encrypted_data', // We'd need to mock encoder/decoder to test this fully end-to-end, but catching fetch is key
      }

      global.fetch = mock(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockResponse),
        } as any)
      ) as any

      // We expect it to eventually fail decryption or validation if we don't return valid encrypted data matching our key.
      // But here we test that it attempts to fetch.

      try {
        await action.send()
      } catch (e) {
        // Expected because 'encrypted_data' is garbage
      }

      expect(global.fetch).toHaveBeenCalled()
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test/path'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        } as any)
      )
    })
  })
})
