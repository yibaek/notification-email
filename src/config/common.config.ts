import { registerAs } from '@nestjs/config';

export default registerAs(
  'common',
  () =>
    ({
      nodeEnv: process.env.NODE_ENV || 'development',
    }) as const,
);
