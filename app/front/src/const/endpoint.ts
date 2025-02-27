const NEXT_PUBLIC_ENV = process.env.NEXT_PUBLIC_ENV;
export const END_POINT =
  NEXT_PUBLIC_ENV == "dev" ? "http://localhost:5000" : "";
