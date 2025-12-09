/**
 * 物流子類型 (包含超商和宅配的所有子類型)
 */
export enum LogisticsSubType {
  // ========== 超商 B2C ==========

  /**
   * 7-ELEVEN B2C
   */
  UNIMART = 'UNIMART',

  /**
   * 全家 B2C
   */
  FAMI = 'FAMI',

  /**
   * 萊爾富 B2C
   */
  HILIFE = 'HILIFE',

  /**
   * 7-ELEVEN 冷凍店取 B2C
   */
  UNIMART_FREEZE = 'UNIMARTFREEZE',

  // ========== 超商 C2C ==========

  /**
   * 7-ELEVEN C2C
   */
  UNIMART_C2C = 'UNIMARTC2C',

  /**
   * 全家 C2C
   */
  FAMI_C2C = 'FAMIC2C',

  /**
   * 萊爾富 C2C
   */
  HILIFE_C2C = 'HILIFEC2C',

  /**
   * OK超商 C2C
   */
  OKMART_C2C = 'OKMARTC2C',

  // ========== 宅配 ==========

  /**
   * 黑貓宅急便
   */
  TCAT = 'TCAT',

  /**
   * 中華郵政
   */
  POST = 'POST',
}

/**
 * Checks if the subtype is C2C
 */
export function isC2C(subType: LogisticsSubType): boolean {
  return [
    LogisticsSubType.FAMI_C2C,
    LogisticsSubType.UNIMART_C2C,
    LogisticsSubType.HILIFE_C2C,
    LogisticsSubType.OKMART_C2C,
  ].includes(subType)
}
