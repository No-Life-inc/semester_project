import { User } from "../../models/mongoose/UserModel";
import bcrypt from "bcryptjs";
import { generateToken } from "../jwtService";
import { ValidationError } from "../../utility/errors";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../validatorService";

/**
 * Registers a new user.
 *
 * @param name - Name of the user.
 * @param email - Email of the user.
 * @param password - Password of the user.
 * @returns The registered user and JWT token.
 */
export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  validateName(name);
  validateEmail(email);
  validatePassword(password);

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ValidationError("A user with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
  });
  await user.save();

  const token = generateToken({ name: user.name, email: user.email });

  return {
    user: {
      name: user.name,
      email: user.email,
    },
    token,
  };
};

/**
 * Logs in a user.
 *
 * @param email - Email of the user.
 * @param password - Password of the user.
 * @returns The logged-in user and JWT token.
 */
export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ValidationError("Invalid email or password.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ValidationError("Invalid email or password.");
  }

  const token = generateToken({ name: user.name, email: user.email });

  return {
    user: {
      name: user.name,
      email: user.email,
    },
    token,
  };
};
