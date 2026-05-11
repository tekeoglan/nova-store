const sequelize = require('../config/database');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const User = require('../models/User');
const Staff = require('../models/Staff');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    const categoriesData = [
      { CategoryName: 'Elektronik' },
      { CategoryName: 'Giyim' },
      { CategoryName: 'Kitap' },
      { CategoryName: 'Kozmetik' },
      { CategoryName: 'Ev ve Yaşam' },
    ];
    const categories = await Category.bulkCreate(categoriesData);
    console.log('Categories seeded.');

    const productsData = [
      { ProductName: 'Akıllı Telefon', Price: 15000, Stock: 15, CategoryID: categories[0].CategoryID },
      { ProductName: 'Laptop', Price: 25000, Stock: 5, CategoryID: categories[0].CategoryID },
      { ProductName: 'Kulaklık', Price: 1200, Stock: 25, CategoryID: categories[0].CategoryID },
      { ProductName: 'T-Shirt', Price: 400, Stock: 50, CategoryID: categories[1].CategoryID },
      { ProductName: 'Jean Pantolon', Price: 800, Stock: 30, CategoryID: categories[1].CategoryID },
      { ProductName: 'Roman', Price: 150, Stock: 100, CategoryID: categories[2].CategoryID },
      { ProductName: 'Yazılım Kitabı', Price: 300, Stock: 10, CategoryID: categories[2].CategoryID },
      { ProductName: 'Ruj', Price: 200, Stock: 40, CategoryID: categories[3].CategoryID },
      { ProductName: 'Parfüm', Price: 1100, Stock: 12, CategoryID: categories[3].CategoryID },
      { ProductName: 'Koltuk', Price: 5000, Stock: 8, CategoryID: categories[4].CategoryID },
      { ProductName: 'Lamba', Price: 600, Stock: 22, CategoryID: categories[4].CategoryID },
      { ProductName: 'Halı', Price: 2000, Stock: 18, CategoryID: categories[4].CategoryID },
    ];
    const products = await Product.bulkCreate(productsData);
    console.log('Products seeded.');

    const customersData = [
      { FullName: 'Ahmet Yılmaz', City: 'İstanbul', Email: 'ahmet@example.com' },
      { FullName: 'Ayşe Demir', City: 'Ankara', Email: 'ayse@example.com' },
      { FullName: 'Mehmet Kaya', City: 'İzmir', Email: 'mehmet@example.com' },
      { FullName: 'Fatma Çelik', City: 'Bursa', Email: 'fatma@example.com' },
      { FullName: 'Can Özkan', City: 'Antalya', Email: 'can@example.com' },
      { FullName: 'Zeynep Aydın', City: 'İstanbul', Email: 'zeynep@example.com' },
    ];
    const customers = await Customer.bulkCreate(customersData);
    console.log('Customers seeded.');

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({ Username: 'admin', PasswordHash: hashedPassword });
    console.log('Admin user seeded.');

    const staffAdminHash = await bcrypt.hash('admin123', 10);
    await Staff.create({ Email: 'admin@novastore.com', PasswordHash: staffAdminHash, Role: 'admin' });
    const staffModHash = await bcrypt.hash('mod123', 10);
    await Staff.create({ Email: 'mod@novastore.com', PasswordHash: staffModHash, Role: 'moderator' });
    console.log('Staff accounts seeded.');

    const ordersData = [
      { CustomerID: customers[0].CustomerID, TotalAmount: 16200, OrderDate: new Date('2026-01-10') },
      { CustomerID: customers[1].CustomerID, TotalAmount: 25000, OrderDate: new Date('2026-02-15') },
      { CustomerID: customers[2].CustomerID, TotalAmount: 150, OrderDate: new Date('2026-03-05') },
      { CustomerID: customers[0].CustomerID, TotalAmount: 1200, OrderDate: new Date('2026-03-20') },
      { CustomerID: customers[3].CustomerID, TotalAmount: 1200, OrderDate: new Date('2026-04-01') },
      { CustomerID: customers[4].CustomerID, TotalAmount: 6000, OrderDate: new Date('2026-04-10') },
      { CustomerID: customers[5].CustomerID, TotalAmount: 1300, OrderDate: new Date('2026-04-15') },
      { CustomerID: customers[1].CustomerID, TotalAmount: 400, OrderDate: new Date('2026-04-20') },
      { CustomerID: customers[2].CustomerID, TotalAmount: 300, OrderDate: new Date('2026-04-25') },
      { CustomerID: customers[0].CustomerID, TotalAmount: 15000, OrderDate: new Date('2026-04-28') },
    ];
    const orders = await Order.bulkCreate(ordersData);
    console.log('Orders seeded.');

    const detailsData = [
      { OrderID: orders[0].OrderID, ProductID: products[0].ProductID, Quantity: 1 },
      { OrderID: orders[0].OrderID, ProductID: products[2].ProductID, Quantity: 1 },
      { OrderID: orders[1].OrderID, ProductID: products[1].ProductID, Quantity: 1 },
      { OrderID: orders[2].OrderID, ProductID: products[5].ProductID, Quantity: 1 },
      { OrderID: orders[3].OrderID, ProductID: products[2].ProductID, Quantity: 1 },
      { OrderID: orders[4].OrderID, ProductID: products[2].ProductID, Quantity: 1 },
      { OrderID: orders[5].OrderID, ProductID: products[9].ProductID, Quantity: 1 },
      { OrderID: orders[5].OrderID, ProductID: products[10].ProductID, Quantity: 1 },
      { OrderID: orders[6].OrderID, ProductID: products[8].ProductID, Quantity: 1 },
      { OrderID: orders[6].OrderID, ProductID: products[7].ProductID, Quantity: 1 },
      { OrderID: orders[7].OrderID, ProductID: products[3].ProductID, Quantity: 1 },
      { OrderID: orders[8].OrderID, ProductID: products[6].ProductID, Quantity: 1 },
      { OrderID: orders[9].OrderID, ProductID: products[0].ProductID, Quantity: 1 },
    ];
    await OrderDetail.bulkCreate(detailsData);
    console.log('Order details seeded.');

    console.log('Full seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  }
}

module.exports = seed;