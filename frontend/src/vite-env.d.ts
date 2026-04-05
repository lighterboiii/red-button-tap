/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  /** Порт локального бэка (по умолчанию 3001) */
  readonly VITE_API_PORT?: string;
  readonly VITE_UNLIMITED_TAPS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
