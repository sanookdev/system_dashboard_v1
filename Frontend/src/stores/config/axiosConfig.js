const baseApiUrl =
  import.meta.env.VITE_APP_ENV === "development"
    ? import.meta.env.VITE_API_DEVELOPMENT
    : import.meta.env.VITE_API_PRODUCTION;

export default baseApiUrl;
