import pool from "../../../config/db";
import { hashPassword } from "../../../utils/hashPassword";
import { Request, Response } from "express";

export const signUpController = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;
  console.log(`name: ${fullName} , email : ${email} and password:${password}`);

  const hashedPassword = hashPassword(password);

  try {
    if (!fullName || !email || !hashedPassword) {
      res.status(500).send("data missing try again please !");
    } else {
      const lowerCaseName = fullName.toLowerCase();
      const lowerCaseEmail = email.toLowerCase();
      const query = {
        text: "INSERT INTO users(full_name, email, hashed_password) VALUES($1, $2, $3)",
        values: [lowerCaseName, lowerCaseEmail, hashedPassword],
      };

      await pool.query(query);
      res.status(201).send(`User added successfully`);
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send("Something wrong happened while trying to add a user!");
    return;
  }
};

export default signUpController;
