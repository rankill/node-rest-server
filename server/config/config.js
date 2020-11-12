// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


process.env.DB_URL = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/coffee' : 'mongodb+srv://rankill:6ZqbPvuwmq73o0pJ@cluster0.c4gna.mongodb.net/coffee?retryWrites=true&w=majority'

