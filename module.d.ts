declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    RESEND_API_KEY: string;
    RESEND_CONFIRM_URL: string;
  }
}
