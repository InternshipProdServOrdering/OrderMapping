const mongoose = require('mongoose');

const orderMappingSchema = new mongoose.Schema({
    productOrderId: { type: String, required: true, unique: true },
    serviceOrderId: { type: String, required: true, unique: true },
  });

const OrderMapping = mongoose.model('OrderMapping', orderMappingSchema);

class OrderMappingService {
    async addMapping(productOrderId, serviceOrderId) {
        const mapping = new OrderMapping({productOrderId, serviceOrderId});
        await mapping.save();
    }

    async getServiceOrderId(productOrderId){
        const mapping = await OrderMapping.findOne({productOrderId});
        return mapping ? mapping.serviceOrderId : null;
    }

    async getProductOrderId(serviceOrderId){
        const mapping = await OrderMapping.findOne({serviceOrderId});
        return mapping ? mapping.serviceOrderId : null;
    }
}

module.exports = new OrderMappingService();