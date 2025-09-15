module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    shopifyId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    totalSpent: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    ordersCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    tenantId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'customers',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['shopifyId', 'tenantId']
      }
    ]
  });

  return Customer;
};