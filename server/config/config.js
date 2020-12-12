// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


process.env.DB_URL = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/coffee' : process.env.MONGO_URI

process.env.TOKEN_EXPIRES = {expiresIn: 60 * 60 * 24 * 30}

process.env.SEED = process.env.SEED || 'dev-seed'

process.env.GOOGLE_CLIENTID = process.env.GOOGLE_CLIENTID || '970796713330-npi36hjsqgb3t6p08qiuonng3omkbimb.apps.googleusercontent.com'
