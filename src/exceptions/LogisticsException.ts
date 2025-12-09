/**
 * Logistics Exception
 *
 * Base exception class for all logistics-related errors.
 */
export class LogisticsException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'LogisticsException'
    Object.setPrototypeOf(this, LogisticsException.prototype)
  }

  /**
   * Required field is missing
   */
  static required(field: string): LogisticsException {
    return new LogisticsException(`${field} 為必填欄位。`)
  }

  /**
   * Field value is invalid
   */
  static invalid(field: string, reason: string = ''): LogisticsException {
    const message = reason !== '' ? `${field} 格式無效：${reason}` : `${field} 格式無效。`

    return new LogisticsException(message)
  }

  /**
   * Field value exceeds maximum length
   */
  static tooLong(field: string, maxLength: number): LogisticsException {
    return new LogisticsException(`${field} 不可超過 ${maxLength} 個字元。`)
  }

  /**
   * HTTP request failed
   */
  static httpError(message: string): LogisticsException {
    return new LogisticsException(`HTTP 請求錯誤：${message}`)
  }

  /**
   * API returned an error
   */
  static apiError(code: string | number, message: string): LogisticsException {
    return new LogisticsException(`API 錯誤 [${code}]：${message}`)
  }

  /**
   * Value is not in the allowed range
   */
  static notInRange(field: string, allowedValues: (string | number)[]): LogisticsException {
    const values = allowedValues.join(', ')
    return new LogisticsException(`${field} 必須為下列值之一：${values}`)
  }
}
