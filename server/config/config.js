// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


process.env.DB_URL = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/coffee' : process.env.MONGO_URI