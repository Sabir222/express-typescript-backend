import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import pool from "../../../config/db";
import { comparePassword } from "../../../utils/hashPassword";

const loginController = async (req: Request, res: Response) => {
  const { user_email, password } = req.body;

  try {
    const query = {
      text: "SELECT * FROM users WHERE  email = $1",
      values: [user_email],
    };
    const result = await pool.query(query);

    const { user_id, email, full_name, role, hashed_password } = result.rows[0];

    if (!comparePassword(password, hashed_password)) {
      return res.json("error pw");
    }

    const access_token = jwt.sign({ id: user_id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const refresh_token = jwt.sign(
      { id: user_id },
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
  } catch (error) {
    throw error;
  }
};

export default loginController;
