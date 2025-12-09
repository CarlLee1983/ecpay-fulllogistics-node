import { createCipheriv, createDecipheriv } from 'node:crypto'
import { Buffer } from 'node:buffer'

/**
 * Service for AES encryption and decryption
 *
 * Implements AES-128-CBC encryption compatible with ECPay's specification.
 */
export class CipherService {
  private readonly algorithm = 'aes-128-cbc'
  private readonly key: Buffer
  private readonly iv: Buffer

  /**
   * @param hashKey 16-byte HashKey
   * @param hashIv 16-byte HashIV
   */
  constructor(hashKey: string, hashIv: string) {
    if (hashKey.length !== 16) {
      throw new Error('HashKey must be 16 characters long')
    }
    if (hashIv.length !== 16) {
      throw new Error('HashIV must be 16 characters long')
    }

    this.key = Buffer.from(hashKey, 'utf8')
    this.iv = Buffer.from(hashIv, 'utf8')
  }

  /**
   * Encrypts plaintext using AES-128-CBC
   *
   * @param plaintext Text to encrypt
   * @returns Base64 encoded encrypted string
   */
  encrypt(plaintext: string): string {
    // URL Encode the plaintext first according to ECPay spec
    const encodedText = encodeURIComponent(plaintext).replace(/%20/g, '+')

    const cipher = createCipheriv(this.algorithm, this.key, this.iv)
    cipher.setAutoPadding(true) // PKCS7 padding is default in Node.js

    const encrypted = Buffer.concat([cipher.update(encodedText, 'utf8'), cipher.final()])

    return encrypted.toString('base64')
  }

  /**
   * Decrypts ciphertext using AES-128-CBC
   *
   * @param ciphertext Base64 encoded encrypted string
   * @returns Decrypted plaintext
   */
  decrypt(ciphertext: string): string {
    const decipher = createDecipheriv(this.algorithm, this.key, this.iv)
    decipher.setAutoPadding(true)

    const encryptedBuffer = Buffer.from(ciphertext, 'base64')
    const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()])

    // URL Decode the result
    return decodeURIComponent(decrypted.toString('utf8').replace(/\+/g, '%20'))
  }
}
