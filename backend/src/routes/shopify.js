const express = require('express');
const axios = require('axios');
const { Tenant, Customer, Order, Product } = require('../models');
const router = express.Router();

// Middleware to verify tenant
const verifyTenant = async (req, res, next) => {
  try {
    const tenant = await Tenant.findByPk(req.headers['x-tenant-id']);
    if (!tenant) {
      return res.status(401).json({ error: 'Invalid tenant' });
    }
    req.tenant = tenant;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sync data from Shopify
router.post('/sync', verifyTenant, async (req, res) => {
  try {
    const { tenant } = req;
    const shopify = axios.create({
      baseURL: `https://${tenant.shopifyDomain}/admin/api/2024-01`,
      headers: {
        'X-Shopify-Access-Token': tenant.accessToken,
        'Content-Type': 'application/json'
      }
    });

    // Sync products
    const productsResponse = await shopify.get('/products.json');
    await Promise.all(productsResponse.data.products.map(async (product) => {
      await Product.upsert({
        shopifyId: product.id,
        title: product.title,
        price: product.variants[0]?.price,
        inventory: product.variants[0]?.inventory_quantity,
        tenantId: tenant.id
      });
    }));

    // Sync customers
    const customersResponse = await shopify.get('/customers.json');
    await Promise.all(customersResponse.data.customers.map(async (customer) => {
      await Customer.upsert({
        shopifyId: customer.id,
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name,
        totalSpent: customer.total_spent,
        ordersCount: customer.orders_count,
        tenantId: tenant.id
      });
    }));

    // Sync orders
    const ordersResponse = await shopify.get('/orders.json?status=any');
    await Promise.all(ordersResponse.data.orders.map(async (order) => {
      await Order.upsert({
        shopifyId: order.id,
        orderNumber: order.order_number,
        totalPrice: order.total_price,
        financialStatus: order.financial_status,
        fulfillmentStatus: order.fulfillment_status,
        customerId: order.customer?.id,
        tenantId: tenant.id,
        createdAt: order.created_at
      });
    }));

    res.json({ message: 'Sync completed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;