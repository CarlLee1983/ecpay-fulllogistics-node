import { describe, expect, it } from 'bun:test'
import { Response } from '../../src/core/Response'
import { PayloadEncoder } from '../../src/core/PayloadEncoder'

describe('Response', () => {
  const hashKey = '5294y06JbISpM5x9'
  const hashIv = 'v77hoKGq4kWxNNIS'
  const encoder = new PayloadEncoder(hashKey, hashIv)

  it('should parse success response correctly', () => {
    // Encrypt some data for testing
    const innerData = {
      RtnCode: 1,
      RtnMsg: 'OK',
      AllPayLogisticsID: '123456',
    }
    const encryptedData = encoder.encode('2000132', innerData).Data

    const rawResponse = {
      TransCode: 1,
      TransMsg: 'Success',
      Data: encryptedData,
    }

    const response = new Response(rawResponse, encoder)

    expect(response.isSuccess()).toBe(true)
    expect(response.getRtnCode()).toBe(1)
    expect(response.getRtnMsg()).toBe('OK')
    expect(response.getAllPayLogisticsID()).toBe('123456')
  })

  it('should handle response without encrypted data', () => {
    // Some error responses might return plain object or null in Data
    const rawResponse = {
      TransCode: 0,
      TransMsg: 'Error',
      Data: {
        RtnCode: 0,
        RtnMsg: 'Failed',
      },
    }

    const response = new Response(rawResponse, encoder)

    expect(response.isSuccess()).toBe(false)
    expect(response.getRtnCode()).toBe(0)
    expect(response.getRtnMsg()).toBe('Failed')
  })

  it('should fallback to TransCode if RtnCode is missing', () => {
    const rawResponse = {
      TransCode: 500,
      TransMsg: 'System Error',
      Data: {}, // Empty data
    }

    const response = new Response(rawResponse) // No encoder needed if no encrypted data

    expect(response.getRtnCode()).toBe(500)
    expect(response.getRtnMsg()).toBe('System Error')
  })

  describe('getData()', () => {
    it('should return the full data object', () => {
      const rawResponse = {
        TransCode: 1,
        TransMsg: 'Success',
        Data: {
          RtnCode: 1,
          RtnMsg: 'OK',
          AllPayLogisticsID: '123456789',
          LogisticsStatus: '300',
        },
      }

      const response = new Response(rawResponse)
      const data = response.getData()

      expect(data.RtnCode).toBe(1)
      expect(data.RtnMsg).toBe('OK')
      expect(data['AllPayLogisticsID']).toBe('123456789')
      expect(data['LogisticsStatus']).toBe('300')
    })
  })

  describe('get()', () => {
    it('should return a specific field value', () => {
      const rawResponse = {
        TransCode: 1,
        TransMsg: 'Success',
        Data: {
          RtnCode: 1,
          RtnMsg: 'OK',
          CustomField: 'custom_value',
        },
      }

      const response = new Response(rawResponse)

      expect(response.get('RtnCode')).toBe(1)
      expect(response.get('RtnMsg')).toBe('OK')
    })
  })

  describe('convenience getter methods', () => {
    const rawResponse = {
      TransCode: 1,
      TransMsg: 'Success',
      Data: {
        RtnCode: 1,
        RtnMsg: 'OK',
        AllPayLogisticsID: 'LP123456789',
        LogisticsStatus: '300',
        MerchantTradeNo: 'ORDER_1234567890',
        ShipmentNo: 'SHIP123',
        PrintUrl: 'https://example.com/print',
        CVSValidationNo: 'CVS123456',
        ReceiverStoreID: '991182',
        ReceiverStoreName: '7-ELEVEN 測試門市',
      },
    }

    it('should get logistics status', () => {
      const response = new Response(rawResponse)
      expect(response.getLogisticsStatus()).toBe('300')
    })

    it('should get merchant trade no', () => {
      const response = new Response(rawResponse)
      expect(response.getMerchantTradeNo()).toBe('ORDER_1234567890')
    })

    it('should get shipment no', () => {
      const response = new Response(rawResponse)
      expect(response.getShipmentNo()).toBe('SHIP123')
    })

    it('should get print URL', () => {
      const response = new Response(rawResponse)
      expect(response.getPrintUrl()).toBe('https://example.com/print')
    })

    it('should get CVS validation no', () => {
      const response = new Response(rawResponse)
      expect(response.getCVSValidationNo()).toBe('CVS123456')
    })

    it('should get receiver store ID', () => {
      const response = new Response(rawResponse)
      expect(response.getReceiverStoreID()).toBe('991182')
    })

    it('should get receiver store name', () => {
      const response = new Response(rawResponse)
      expect(response.getReceiverStoreName()).toBe('7-ELEVEN 測試門市')
    })

    it('should return undefined for missing fields', () => {
      const minimalResponse = {
        TransCode: 1,
        TransMsg: 'Success',
        Data: {
          RtnCode: 1,
          RtnMsg: 'OK',
        },
      }

      const response = new Response(minimalResponse)

      expect(response.getLogisticsStatus()).toBeUndefined()
      expect(response.getMerchantTradeNo()).toBeUndefined()
      expect(response.getShipmentNo()).toBeUndefined()
      expect(response.getPrintUrl()).toBeUndefined()
      expect(response.getCVSValidationNo()).toBeUndefined()
      expect(response.getReceiverStoreID()).toBeUndefined()
      expect(response.getReceiverStoreName()).toBeUndefined()
    })
  })

  describe('decryption error handling', () => {
    it('should handle decryption failure gracefully', () => {
      const rawResponse = {
        TransCode: 1,
        TransMsg: 'Success',
        Data: 'invalid_encrypted_data_that_cannot_be_decrypted',
      }

      // This should not throw, but handle the error gracefully
      const response = new Response(rawResponse, encoder)

      // TransCode should be mapped to RtnCode
      expect(response.getRtnCode()).toBe(1)
      expect(response.getRtnMsg()).toBe('Success')
    })
  })
})
