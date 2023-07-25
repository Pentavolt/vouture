import decode, { JwtPayload } from "jwt-decode";

export const isExpired = (token: string) => {
  const decoded = decode<JwtPayload>(token);
  if (decoded.exp && decoded.exp * 1000 < Date.now()) return true;
  return false;
};

export const hasExceeded = (
  x: number,
  y: number,
  x_min: number,
  x_max: number,
  y_min: number,
  y_max: number
) => {
  return x < x_min || x > x_max || y < y_min || y > y_max;
};
