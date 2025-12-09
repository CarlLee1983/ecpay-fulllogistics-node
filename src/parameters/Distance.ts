/**
 * 配送距離 (宅配專用參數)
 */
export enum Distance {
    /**
     * 同縣市
     */
    SAME = '00',

    /**
     * 外縣市
     */
    OTHER = '01',

    /**
     * 離島
     */
    ISLAND = '02',
}
