const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const Product = require('../models/Product');
const User = require('../models/User');
const appConfig = require('../config/app');

// Get order history for authenticated user
router.get('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, appConfig.jwtSecret);

    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const orders = await Order.findAll({
      where: { CustomerID: user.CustomerID },
      include: [
        { model: OrderDetail, include: [Product] }
      ],
      order: [['OrderDate', 'DESC']],
    });

    res.json(orders.map(order => ({
      orderId: order.OrderID,
      totalAmount: order.TotalAmount,
      orderDate: order.OrderDate,
      items: order.OrderDetails.map(d => ({
        productId: d.ProductID,
        productName: d.Product ? d.Product.ProductName : '',
        quantity: d.Quantity,
        price: d.Product ? parseFloat(d.Product.Price) : 0,
      })),
    })));
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, appConfig.jwtSecret);

    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items are required' });
    }

    let totalAmount = 0;
    const orderDetails = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.productId} not found` });
      }
      totalAmount += parseFloat(product.Price) * item.quantity;
      orderDetails.push({
        ProductID: parseInt(item.productId),
        Quantity: item.quantity,
      });
    }

    const order = await Order.create({
      CustomerID: user.CustomerID,
      TotalAmount: totalAmount,
      OrderDate: new Date(),
    });

    for (const detail of orderDetails) {
      await OrderDetail.create({
        OrderID: order.OrderID,
        ProductID: detail.ProductID,
        Quantity: detail.Quantity,
      });
    }

    const createdOrder = await Order.findByPk(order.OrderID, {
      include: [
        { model: OrderDetail, include: [Product] }
      ]
    });

    res.status(201).json({
      orderId: order.OrderID,
      totalAmount: order.TotalAmount,
      orderDate: order.OrderDate,
      items: createdOrder.OrderDetails.map(d => ({
        productId: d.ProductID,
        productName: d.Product ? d.Product.ProductName : '',
        quantity: d.Quantity,
        price: d.Product ? parseFloat(d.Product.Price) : 0,
      })),
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;