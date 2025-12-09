import { describe, expect, it } from 'bun:test'
import { CipherService } from '../../src/core/CipherService'

describe('CipherService', () => {
  const hashKey = '5294y06JbISpM5x9' // ECPay Staging HashKey
  const hashIv = 'v77hoKGq4kWxNNIS' // ECPay Staging HashIV
  const service = new CipherService(hashKey, hashIv)

  it('should encrypt and decrypt correctly', () => {
    const plaintext = '{"MerchantID":"2000132"}'
    const encrypted = service.encrypt(plaintext)
    const decrypted = service.decrypt(encrypted)

    expect(decrypted).toBe(plaintext)
  })

  it('should handle special characters and unicode', () => {
    const plaintext = '{"Name":"測試","Symbol":"&%"}'
    const encrypted = service.encrypt(plaintext)
    const decrypted = service.decrypt(encrypted)

    expect(decrypted).toBe(plaintext)
  })

  it('should handle URL encoding as per ECPay spec', () => {
    // ECPay spec requires URL encoding before encryption, and decoding after decryption
    // Spaces should be replaced with '+' and resulting string is encrypted
    const plaintext = 'Hello World'
    const encrypted = service.encrypt(plaintext)
    const decrypted = service.decrypt(encrypted)

    expect(decrypted).toBe(plaintext)
  })

  it('should throw error for invalid key length', () => {
    expect(() => new CipherService('123', hashIv)).toThrow('HashKey must be 16 characters long')
  })

  it('should throw error for invalid IV length', () => {
    expect(() => new CipherService(hashKey, '123')).toThrow('HashIV must be 16 characters long')
  })
})
