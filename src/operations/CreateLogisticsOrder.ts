
import { BaseAction } from '../core/BaseAction.js'
import { LogisticsException } from '../exceptions/LogisticsException.js'
import { LogisticsType } from '../parameters/LogisticsType.js'
import { LogisticsSubType } from '../parameters/LogisticsSubType.js'
import { Temperature } from '../parameters/Temperature.js'
import { Distance } from '../parameters/Distance.js'
import { Specification } from '../parameters/Specification.js'

import { IsCollection } from '../parameters/IsCollection.js'
import { ScheduledPickupTime } from '../parameters/ScheduledPickupTime.js'
import { ScheduledDeliveryTime } from '../parameters/ScheduledDeliveryTime.js'

export class CreateLogisticsOrder extends BaseAction {
    protected requestPath = '/Express/v2/CreateLogisticsOrder'

    private static readonly GOODS_NAME_MAX_LENGTH = 50
    private static readonly SENDER_NAME_MAX_LENGTH = 10
    private static readonly RECEIVER_NAME_MAX_LENGTH = 10

    constructor(config: any) {
        super(config)
        this.content.Data.MerchantTradeDate = this.formatDate(new Date())
        this.content.Data.LogisticsType = LogisticsType.CVS
        this.content.Data.IsCollection = IsCollection.NO
    }

    // Setters

    public setTempLogisticsID(tempLogisticsId: string): this {
        this.content.Data.TempLogisticsID = tempLogisticsId
        return this
    }

    public setLogisticsType(type: LogisticsType): this {
        this.content.Data.LogisticsType = type
        return this
    }

    public setLogisticsSubType(subType: LogisticsSubType): this {
        this.content.Data.LogisticsSubType = subType
        // In PHP: $subType->getLogisticsType()->value
        // Here we might need mapping logic if we want to auto-set LogisticsType.
        // For now, let's assume user sets compatible types or we add logic later.
        // But PHP SDK does auto-set LogisticsType.
        // Simple mapping for now:
        if (subType === LogisticsSubType.UNIMART || subType === LogisticsSubType.FAMI || subType === LogisticsSubType.HILIFE || subType === LogisticsSubType.OKMART_C2C) {
            this.content.Data.LogisticsType = LogisticsType.CVS
        }
        // TODO: More robust mapping if needed.
        // Checking PHP:
        // UNIMART -> CVS
        // FAMI -> CVS
        // HILIFE -> CVS
        // UNIMART_C2C -> CVS
        // FAMI_C2C -> CVS
        // HILIFE_C2C -> CVS
        // OKMART_C2C -> CVS
        // TCAT -> HOME
        // POST -> HOME

        if (subType === LogisticsSubType.TCAT || subType === LogisticsSubType.POST) {
            this.content.Data.LogisticsType = LogisticsType.HOME
        } else {
            this.content.Data.LogisticsType = LogisticsType.CVS
        }

        return this
    }

    public setIsCollection(isCollection: IsCollection | string): this {
        this.content.Data.IsCollection = isCollection
        return this
    }

    public setGoodsAmount(amount: number): this {
        if (amount < 0) {
            throw LogisticsException.invalid('GoodsAmount', '金額不可為負數')
        }
        this.content.Data.GoodsAmount = amount
        return this
    }

    public setCollectionAmount(amount: number): this {
        if (amount < 0) {
            throw LogisticsException.invalid('CollectionAmount', '金額不可為負數')
        }
        this.content.Data.CollectionAmount = amount
        return this
    }

    public setGoodsName(name: string): this {
        // Basic length check, assuming ASCII mostly or using simple length. 
        // PHP uses mb_strlen. JS string.length is UTF-16 code units.
        // Usually OK for basic check, but if strict byte length needed, might need TextEncoder.
        // Let's use simple length for now, matching PHP mb_strlen default behavior behavior (char count).
        if (name.length > CreateLogisticsOrder.GOODS_NAME_MAX_LENGTH) {
            throw LogisticsException.tooLong('GoodsName', CreateLogisticsOrder.GOODS_NAME_MAX_LENGTH)
        }
        this.content.Data.GoodsName = name
        return this
    }

    public setSenderName(name: string): this {
        if (name.length > CreateLogisticsOrder.SENDER_NAME_MAX_LENGTH) {
            throw LogisticsException.tooLong('SenderName', CreateLogisticsOrder.SENDER_NAME_MAX_LENGTH)
        }
        this.content.Data.SenderName = name
        return this
    }

    public setSenderPhone(phone: string): this {
        this.content.Data.SenderPhone = phone
        return this
    }

    public setSenderCellPhone(cellPhone: string): this {
        this.content.Data.SenderCellPhone = cellPhone
        return this
    }

    public setSenderZipCode(zipCode: string): this {
        this.content.Data.SenderZipCode = zipCode
        return this
    }

    public setSenderAddress(address: string): this {
        this.content.Data.SenderAddress = address
        return this
    }

    public setReceiverName(name: string): this {
        if (name.length > CreateLogisticsOrder.RECEIVER_NAME_MAX_LENGTH) {
            throw LogisticsException.tooLong('ReceiverName', CreateLogisticsOrder.RECEIVER_NAME_MAX_LENGTH)
        }
        this.content.Data.ReceiverName = name
        return this
    }

    public setReceiverPhone(phone: string): this {
        this.content.Data.ReceiverPhone = phone
        return this
    }

    public setReceiverCellPhone(cellPhone: string): this {
        this.content.Data.ReceiverCellPhone = cellPhone
        return this
    }

    public setReceiverEmail(email: string): this {
        this.content.Data.ReceiverEmail = email
        return this
    }

    public setReceiverZipCode(zipCode: string): this {
        this.content.Data.ReceiverZipCode = zipCode
        return this
    }

    public setReceiverAddress(address: string): this {
        this.content.Data.ReceiverAddress = address
        return this
    }

    public setReceiverStoreID(storeId: string): this {
        this.content.Data.ReceiverStoreID = storeId
        return this
    }

    public setReturnStoreID(storeId: string): this {
        this.content.Data.ReturnStoreID = storeId
        return this
    }

    public setTemperature(temperature: Temperature): this {
        this.content.Data.Temperature = temperature
        return this
    }

    public setDistance(distance: Distance): this {
        this.content.Data.Distance = distance
        return this
    }

    public setSpecification(specification: Specification): this {
        this.content.Data.Specification = specification
        return this
    }

    public setScheduledPickupTime(time: ScheduledPickupTime): this {
        this.content.Data.ScheduledPickupTime = time
        return this
    }

    public setScheduledDeliveryTime(time: ScheduledDeliveryTime): this {
        this.content.Data.ScheduledDeliveryTime = time
        return this
    }

    public setScheduledPickupDate(date: string): this {
        this.content.Data.ScheduledPickupDate = date
        return this
    }

    public setScheduledDeliveryDate(date: string): this {
        this.content.Data.ScheduledDeliveryDate = date
        return this
    }

    // Convenience methods

    public useUnimartC2C(): this {
        return this.setLogisticsSubType(LogisticsSubType.UNIMART_C2C)
    }

    public useFamiC2C(): this {
        return this.setLogisticsSubType(LogisticsSubType.FAMI_C2C)
    }

    public useHilifeC2C(): this {
        return this.setLogisticsSubType(LogisticsSubType.HILIFE_C2C)
    }

    public useOkmartC2C(): this {
        return this.setLogisticsSubType(LogisticsSubType.OKMART_C2C)
    }

    public useUnimartB2C(): this {
        return this.setLogisticsSubType(LogisticsSubType.UNIMART)
    }

    public useFamiB2C(): this {
        return this.setLogisticsSubType(LogisticsSubType.FAMI)
    }

    public useHilifeB2C(): this {
        return this.setLogisticsSubType(LogisticsSubType.HILIFE)
    }

    public useTcat(): this {
        return this.setLogisticsSubType(LogisticsSubType.TCAT)
    }

    public usePost(): this {
        return this.setLogisticsSubType(LogisticsSubType.POST)
    }

    public withCollection(amount: number = 0): this {
        this.setIsCollection(IsCollection.YES)
        if (amount > 0) {
            this.setCollectionAmount(amount)
        }
        return this
    }

    public withoutCollection(): this {
        return this.setIsCollection(IsCollection.NO)
    }

    protected override validate(): void {
        // If has TempLogisticsID, minimal validation
        if (this.content.Data.TempLogisticsID) {
            return
        }

        if (!this.content.Data.MerchantTradeNo) {
            throw LogisticsException.required('MerchantTradeNo')
        }
        if (!this.content.Data.LogisticsType) {
            throw LogisticsException.required('LogisticsType')
        }
        if (!this.content.Data.LogisticsSubType) {
            throw LogisticsException.required('LogisticsSubType')
        }
        if (!this.content.Data.GoodsName) {
            throw LogisticsException.required('GoodsName')
        }
        if (!this.content.Data.SenderName) {
            throw LogisticsException.required('SenderName')
        }
        if (!this.content.Data.ReceiverName) {
            throw LogisticsException.required('ReceiverName')
        }
        if (!this.content.Data.ServerReplyURL) {
            throw LogisticsException.required('ServerReplyURL')
        }
    }
}
