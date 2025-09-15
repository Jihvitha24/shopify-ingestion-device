module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    shopifyId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    orderNumber: {
      type: DataTypes.STRING
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2)
    },
    financialStatus: {
      type: DataTypes.STRING
    },
    fulfillmentStatus: {
      type: DataTypes.STRING
    },
    customerId: {
      type: DataTypes.BIGINT
    },
    tenantId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'orders',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['shopifyId', 'tenantId']
      }
    ]
  });

  return Order;
};