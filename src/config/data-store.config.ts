import { registerAs } from '@nestjs/config';

export default registerAs(
  'ds',
  () =>
    ({
      mongo: {
        host: process.env.MONGO_HOST,
        port: +process.env.MONGO_PORT,
        database: process.env.MONGO_DATABASE,
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD,
        url: process.env.MONGO_URL,
      },
    }) as const,
);
