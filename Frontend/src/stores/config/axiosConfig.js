const isProduction = import.meta.env.VITE_IS_PRODUCTION === "true"

const baseApiUrl =
  isProduction
    ? import.meta.env.VITE_API_PRODUCTION
    : import.meta.env.VITE_API_DEVELOPMENT;

export default baseApiUrl;
