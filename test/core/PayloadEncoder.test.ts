import { describe, expect, it } from 'bun:test'
import { PayloadEncoder } from '../../src/core/PayloadEncoder'

describe('PayloadEncoder', () => {
  const hashKey = '5294y06JbISpM5x9'
  const hashIv = 'v77hoKGq4kWxNNIS'
  const encoder = new PayloadEncoder(hashKey, hashIv)
  const merchantId = '2000132'

  it('should encode request data correctly', () => {
    const data = { Amount: 100, Description: 'Test' }
    const result = encoder.encode(merchantId, data)

    expect(result.MerchantID).toBe(merchantId)
    expect(result.RqHeader.Revision).toBe('1.0.0')
    expect(result.RqHeader.Timestamp).toBeGreaterThan(0)
    expect(typeof result.Data).toBe('string')
    expect(result.Data.length).toBeGreaterThan(0)
  })

  it('should decode encrypted response data correctly', () => {
    const originalData = { RtnCode: 1, RtnMsg: 'OK' }
    // Manually encrypt primarily to test decode
    const encoded = encoder.encode(merchantId, originalData)

    const decoded = encoder.decode(encoded.Data)
    expect(decoded).toEqual(originalData)
  })

  it('should throw error on malformed encrypted data', () => {
    expect(() => encoder.decode('invalid-base64')).toThrow()
  })
})
