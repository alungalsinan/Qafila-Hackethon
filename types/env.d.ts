declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_OPENROUTER_API_KEY: string;
      EXPO_PUBLIC_SITE_URL: string;
      EXPO_PUBLIC_SITE_NAME: string;
    }
  }
}

export {};