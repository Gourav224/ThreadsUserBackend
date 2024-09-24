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
			return { id: "First name, email, and password are required." };
		}

		const { firstName, lastName, email, password } = user;

		// Check if the email is already in use
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return { id: "Email already in use." };
		}

		// Generate salt and hash the password
		const salt = await genSalt(10);
		const hashPassword = await hash(password, salt);

		try {
			return await prisma.user.create({
				data: {
					firstName,
					lastName: lastName || "",
					email,
					password: hashPassword, // Store hashed password
					salt, // Store salt if needed for later password verification
				},
			});
		} catch (error) {
			return { id: "User creation failed. Please try again." };
		}
	}
	private static async getUser(email: string) {
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
		const salt = await genSalt(10);
		const hashPassword = await hash(password, salt);
		const isValid = await compare(hashPassword, user.password);
		if (!isValid) {
			throw new Error("Invalid password.");
		}
		const token = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.JWT_SECRET as string,
		);
		return token;
	}
}

export default UserService;
