import 'dotenv/config';

export const AppConfig = {
    MongoURI: process.env.MONGODB_URI,
    NodeEnv: process.env.NODE_ENV,
    AppPort: process.env.APP_PORT || 3000,
    tokenSecretOrKey: process.env.TOKEN_SECRET_KEY,
    saltOrRounds: Number(process.env.SALT_ROUNDS) || 10,
};
