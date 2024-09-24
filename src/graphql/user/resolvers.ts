import type { IUser, IUserToken } from "../../services/user";
import UserService from "../../services/user";

const queries = {
	login: async (_: any, payload: IUserToken) => {
		const token = await UserService.getUserToken(payload);
		return token;
	},
	getCurrentUser: async (_: any, payload: any, context: any) => {
		console.log(context);
		return await UserService.getUser(context.user.email);
	}
};

const mutations = {
	createUser: async (_: any, payload: IUser) => {
		try {
			const user = await UserService.createUser(payload);
			return user;
		} catch (error: any) {
			throw new Error(error?.message);
		}
	},
};

export const resolvers = { queries, mutations };
