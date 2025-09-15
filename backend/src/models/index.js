const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Create sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'shopify_db',
  process.env.DB_USER || 'admin',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false
  }
);

// Test database connection
sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection failed:', err));

// Import all models
const Tenant = require('./Tenant')(sequelize, DataTypes);
const Customer = require('./Customer')(sequelize, DataTypes);
const Order = require('./Order')(sequelize, DataTypes);
const Product = require('./Product')(sequelize, DataTypes);

// Define relationships
Tenant.hasMany(Customer, { foreignKey: 'tenantId' });
Tenant.hasMany(Order, { foreignKey: 'tenantId' });
Tenant.hasMany(Product, { foreignKey: 'tenantId' });

Customer.belongsTo(Tenant, { foreignKey: 'tenantId' });
Order.belongsTo(Tenant, { foreignKey: 'tenantId' });
Product.belongsTo(Tenant, { foreignKey: 'tenantId' });

module.exports = {
  sequelize,
  Tenant,
  Customer,
  Order,
  Product
};