import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const refreshController = (req: Request, res: Response) => {
  const { SabirAuthRefresh } = req.cookies;

  if (!SabirAuthRefresh) {
    return res.status(400).json({ message: "Refresh token is expired!" });
  }

  const decoded: any = jwt.verify(
    SabirAuthRefresh,
    process.env.JWT_REFRESH_SECRET!
  );

  const access_token = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const refresh_token = jwt.sign(
    { id: decoded.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );

  res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME!, refresh_token, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE),
  });

  res.cookie(process.env.ACCESS_TOKEN_COOKIE_NAME!, access_token, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: Number(process.env.ACCESS_TOKEN_COOKIE_MAX_AGE),
  });

  return res.json({ access_token }).status(200);
};

export default refreshController;
