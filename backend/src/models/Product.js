module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    shopifyId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.DECIMAL(10, 2)
    },
    inventory: {
      type: DataTypes.INTEGER
    },
    tenantId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'products',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['shopifyId', 'tenantId']
      }
    ]
  });

  return Product;
};