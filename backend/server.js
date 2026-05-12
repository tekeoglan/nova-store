require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const reportRoutes = require('./routes/reports');
const authRoutes = require('./routes/auth');
const staffAuthRoutes = require('./routes/staffAuth');
const appConfig = require('./config/app')
const seed = require('./database/seed')

// Modelleri içe aktar (Sadece ilişkilerin kurulması için)
require('./models/Category');
require('./models/Product');
require('./models/Customer');
require('./models/Order');
require('./models/OrderDetail');
require('./models/User');
require('./models/Staff');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const PORT = appConfig.port;

const app = express();

app.use(cors({ origin: appConfig.webURL }));
app.use(express.json());

// Rotaları ekle
app.use('/api/auth', authRoutes);
app.use('/api/staff', staffAuthRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

if (appConfig.env === 'development') {
  const errorhandler = require('errorhandler');
  app.use(errorhandler());
}

// Ana sayfa
app.get('/', (req, res) => {
  res.send('NovaStore Backend API is running. Use /api/auth for auth, /api/staff for staff auth, and /api/reports for reports.');
});

async function startServer() {
  try {
    // Veritabanı şemasını senkronize et
    await sequelize.sync();
    console.log('Database synchronized successfully.');

    if (appConfig.env == "development") {
      await seed()
    }

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer();
