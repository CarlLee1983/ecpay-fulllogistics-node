import { ApiMode } from '../parameters/ApiMode.js'

export interface EcPayConfig {
    merchantId: string
    hashKey: string
    hashIv: string
    mode: ApiMode
}
