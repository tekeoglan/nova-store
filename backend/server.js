require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const reportRoutes = require('./routes/reports');
const authRoutes = require('./routes/auth');
const appConfig = require('./config/app')
const seed = require('./database/seed')

// Modelleri içe aktar (Sadece ilişkilerin kurulması için)
require('./models/Category');
require('./models/Product');
require('./models/Customer');
require('./models/Order');
require('./models/OrderDetail');
require('./models/User');

const PORT = appConfig.port;

const app = express();

app.use(cors({ origin: appConfig.webURL }));
app.use(express.json());

// Rotaları ekle
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

// Ana sayfa
app.get('/', (req, res) => {
  res.send('NovaStore Backend API is running. Use /api/auth for auth and /api/reports for reports.');
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
