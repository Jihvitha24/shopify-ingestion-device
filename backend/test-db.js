const { sequelize } = require('./src/models');

async function testDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful!');
    
    // Sync all models
    await sequelize.sync({ force: false });
    console.log('Database synced successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Database test failed:', error);
    process.exit(1);
  }
}

testDatabase();