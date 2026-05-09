const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');

// 1. Stok miktarı 20'den az olan ürünler (Azalan sırada)
router.get('/low-stock', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { Stock: { [Op.lt]: 20 } },
      order: [['Stock', 'ASC']],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Hangi müşteri, hangi tarihte sipariş vermiş?
router.get('/order-history', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{
        model: Customer,
        attributes: ['FullName', 'City'],
      }],
      attributes: ['OrderDate', 'TotalAmount'],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Belirli bir müşterinin aldığı ürünlerin detayları
router.get('/customer-purchases/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const customer = await Customer.findOne({
      where: { FullName: { [Op.like]: `%${name}%` } },
      include: [{
        model: Order,
        include: [{
          model: OrderDetail,
          include: [Product],
        }],
      }],
    });
    if (!customer) return res.status(404).json({ message: 'Müşteri bulunamadı' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Hangi kategoride toplam kaç ürün var?
router.get('/category-stats', async (req, res) => {
  try {
    const stats = await Category.findAll({
      attributes: [
        'CategoryName',
        [sequelize.fn('COUNT', sequelize.col('Products.ProductID')), 'productCount'],
      ],
      include: [{
        model: Product,
        attributes: [],
      }],
      group: ['Category.CategoryID'],
    });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Müşteri bazlı toplam ciro (En çok harcayandan en aza)
router.get('/revenue-ranking', async (req, res) => {
  try {
    const rankings = await Customer.findAll({
      attributes: [
        'FullName',
        [sequelize.fn('SUM', sequelize.col('Orders.TotalAmount')), 'totalRevenue'],
      ],
      include: [{
        model: Order,
        attributes: [],
      }],
      group: ['Customer.CustomerID'],
      order: [[sequelize.literal('totalRevenue'), 'DESC']],
    });
    res.json(rankings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Siparişlerin üzerinden kaç gün geçti?
router.get('/order-timing', async (req, res) => {
  try {
    const orders = await Order.findAll({
      attributes: [
        'OrderID',
        'OrderDate',
        [sequelize.literal("CAST(julianday('now') - julianday(OrderDate) AS INTEGER)"), 'daysPassed'],
      ],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
