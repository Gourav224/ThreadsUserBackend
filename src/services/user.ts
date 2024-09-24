import prisma from "../lib/db";
import { hash, genSalt, compare } from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IUser {
	firstName: string;
	lastName?: string;
	email: string;
	password: string;
}

export interface IUserToken {
	email: string;
	password: string;
}

class UserService {
	public static async createUser(user: IUser) {
		// Validate user input
		if (!user.firstName || !user.email || !user.password) {
			throw new Error("First name, email, and password are required.");
		}

		const { firstName, lastName, email, password } = user;

		// Check if the email is already in use
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			throw new Error("Email already in use.");
		}

		// Generate salt and hash the password
		const salt = await genSalt(10);
		const hashPassword = await hash(password, salt);

		try {
			const newUser = await prisma.user.create({
				data: {
					firstName,
					lastName: lastName || "",
					email,
					password: hashPassword, // Store hashed password
					salt, // Store salt if needed for later password verification
				},
			});
			return newUser.id;
		} catch (error) {
			throw new Error("User creation failed. Please try again.");
		}
	}

	public static async getUser(email: string) {
		return await prisma.user.findUnique({
			where: { email },
		});
	}

	public static async getUserToken(payload: IUserToken) {
		const { email, password } = payload;
		const user = await this.getUser(email);
		if (!user) {
			throw new Error("User not found.");
		}
		const isValid = await compare(password, user.password);
		if (!isValid) {
			throw new Error("Invalid password.");
		}
		const token = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.JWT_SECRET as string,
		);
		return token;
	}

	public static decodeToken(token: string) {
		return jwt.verify(token, process.env.JWT_SECRET as string);
	}
}

export default UserService;
