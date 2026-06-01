require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
require('./src/models/index');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/categories', require('./src/routes/categoryRoutes'));
app.use('/api/products', require('./src/routes/productRoutes'));
app.use('/api/orders', require('./src/routes/orderRoutes'));
app.use('/api/courses', require('./src/routes/courseRoutes'));
app.use('/api/courses', require('./src/routes/moduleRoutes'));
app.use('/api', require('./src/routes/lessonRoutes'));
app.use('/api', require('./src/routes/enrollmentRoutes'));
app.use('/api/certificates', require('./src/routes/certificateRoutes'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

if (process.argv.includes('--seed')) {
  require('./src/seeders/seed')().then(() => {
    console.log('Seed completado');
    process.exit(0);
  });
} else {
  sequelize.sync({ force: process.argv.includes('--force') }).then(() => {
    console.log('Base de datos sincronizada');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  });
}
