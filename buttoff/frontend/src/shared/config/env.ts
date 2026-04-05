/** В проде фронт и API на разных доменах — задать VITE_API_URL */
export const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? '';
