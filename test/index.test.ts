import { describe, expect, it } from 'bun:test'
import {
  VERSION,
  ApiMode,
  API_URLS,
  validateConfig,
  getApiUrl,
  type EcPayConfig,
} from '../src/index'

describe('ECPay Full Logistics SDK', () => {
  describe('VERSION', () => {
    it('should export the current version', () => {
      expect(VERSION).toBe('0.0.1')
    })
  })

  describe('ApiMode', () => {
    it('should have Production mode', () => {
      const mode: ApiMode = ApiMode.Production
      expect(mode).toBe(ApiMode.Production)
    })

    it('should have Staging mode', () => {
      const mode: ApiMode = ApiMode.Staging
      expect(mode).toBe(ApiMode.Staging)
    })
  })

  describe('API_URLS', () => {
    it('should have correct production URL', () => {
      expect(API_URLS[ApiMode.Production]).toBe('https://logistics.ecpay.com.tw')
    })

    it('should have correct staging URL', () => {
      expect(API_URLS[ApiMode.Staging]).toBe('https://logistics-stage.ecpay.com.tw')
    })
  })

  describe('validateConfig', () => {
    const validConfig: EcPayConfig = {
      merchantId: '2000132',
      hashKey: '5294y06JbISpM5x9',
      hashIv: 'v77hoKGq4kWxNNIS',
      mode: ApiMode.Staging,
    }

    it('should return true for valid config', () => {
      expect(validateConfig(validConfig)).toBe(true)
    })

    it('should return true for config without mode', () => {
      const config: EcPayConfig = {
        merchantId: '2000132',
        hashKey: '5294y06JbISpM5x9',
        hashIv: 'v77hoKGq4kWxNNIS',
      }
      expect(validateConfig(config)).toBe(true)
    })

    it('should return false for empty merchantId', () => {
      const config: EcPayConfig = {
        ...validConfig,
        merchantId: '',
      }
      expect(validateConfig(config)).toBe(false)
    })

    it('should return false for empty hashKey', () => {
      const config: EcPayConfig = {
        ...validConfig,
        hashKey: '',
      }
      expect(validateConfig(config)).toBe(false)
    })

    it('should return false for empty hashIv', () => {
      const config: EcPayConfig = {
        ...validConfig,
        hashIv: '',
      }
      expect(validateConfig(config)).toBe(false)
    })
  })

  describe('getApiUrl', () => {
    it('should return staging URL by default', () => {
      expect(getApiUrl()).toBe('https://logistics-stage.ecpay.com.tw')
    })

    it('should return staging URL when specified', () => {
      expect(getApiUrl(ApiMode.Staging)).toBe('https://logistics-stage.ecpay.com.tw')
    })

    it('should return production URL when specified', () => {
      expect(getApiUrl(ApiMode.Production)).toBe('https://logistics.ecpay.com.tw')
    })
  })
})
