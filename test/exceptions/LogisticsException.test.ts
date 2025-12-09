import { describe, expect, it } from 'bun:test'
import { LogisticsException } from '../../src/exceptions/LogisticsException'

describe('LogisticsException', () => {
  it('should create required exception', () => {
    const error = LogisticsException.required('MerchantID')
    expect(error.message).toBe('MerchantID 為必填欄位。')
    expect(error).toBeInstanceOf(LogisticsException)
    expect(error.name).toBe('LogisticsException')
  })

  it('should create invalid exception with reason', () => {
    const error = LogisticsException.invalid('Amount', 'must be positive')
    expect(error.message).toBe('Amount 格式無效：must be positive')
    expect(error).toBeInstanceOf(LogisticsException)
  })

  it('should create invalid exception without reason', () => {
    const error = LogisticsException.invalid('Email')
    expect(error.message).toBe('Email 格式無效。')
    expect(error).toBeInstanceOf(LogisticsException)
  })

  it('should create tooLong exception', () => {
    const error = LogisticsException.tooLong('Name', 10)
    expect(error.message).toBe('Name 不可超過 10 個字元。')
    expect(error).toBeInstanceOf(LogisticsException)
  })

  it('should create httpError exception', () => {
    const error = LogisticsException.httpError('Connection timeout')
    expect(error.message).toBe('HTTP 請求錯誤：Connection timeout')
    expect(error).toBeInstanceOf(LogisticsException)
  })

  it('should create apiError exception with numeric code', () => {
    const error = LogisticsException.apiError(500, 'Server Error')
    expect(error.message).toBe('API 錯誤 [500]：Server Error')
    expect(error).toBeInstanceOf(LogisticsException)
  })

  it('should create apiError exception with string code', () => {
    const error = LogisticsException.apiError('10100001', '參數錯誤')
    expect(error.message).toBe('API 錯誤 [10100001]：參數錯誤')
    expect(error).toBeInstanceOf(LogisticsException)
  })

  it('should create notInRange exception with numeric values', () => {
    const error = LogisticsException.notInRange('Amount', [100, 200, 300])
    expect(error.message).toBe('Amount 必須為下列值之一：100, 200, 300')
    expect(error).toBeInstanceOf(LogisticsException)
  })

  it('should create notInRange exception with string values', () => {
    const error = LogisticsException.notInRange('LogisticsType', ['CVS', 'HOME'])
    expect(error.message).toBe('LogisticsType 必須為下列值之一：CVS, HOME')
    expect(error).toBeInstanceOf(LogisticsException)
  })

  it('should be catchable as Error', () => {
    try {
      throw LogisticsException.required('Field')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(LogisticsException)
    }
  })

  it('should preserve prototype chain', () => {
    const error = LogisticsException.required('Field')
    expect(Object.getPrototypeOf(error)).toBe(LogisticsException.prototype)
  })
})
