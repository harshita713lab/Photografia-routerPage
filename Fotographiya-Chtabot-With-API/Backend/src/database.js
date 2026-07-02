// src/database.js
// No MongoDB needed - just a placeholder

const connectDB = () => {
  console.log('✅ Running without database (stateless mode)');
  console.log('💡 Chat history will not be saved');
  return Promise.resolve();
};

module.exports = connectDB;