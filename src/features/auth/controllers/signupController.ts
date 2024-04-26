import pool from "../../../config/db";
import { hashPassword } from "../../../utils/hashPassword";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const signUpController = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;
  console.log(`name: ${fullName} , email : ${email} and password:${password}`);

  const hashedPassword = hashPassword(password);

  try {
    if (!fullName || !email || !hashedPassword) {
      res.status(500).send("data missing try again please !");
      return;
    } else {
      const lowerCaseName = fullName.toLowerCase();
      const lowerCaseEmail = email.toLowerCase();
      const query = {
        text: "INSERT INTO users(full_name, email, hashed_password) VALUES($1, $2, $3) RETURNING user_id",
        values: [lowerCaseName, lowerCaseEmail, hashedPassword],
      };

      const result = await pool.query(query);
      const userId = result.rows[0].user_id;

      const access_token = jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      const refresh_token = jwt.sign(
        { id: userId },
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

      // res.status(201).send(`User added successfully`);
    }
  } catch (error) {
    res.status(500).json(error);
    return;
  }
};

export default signUpController;
