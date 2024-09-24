import type { IUser, IUserToken } from "../../services/user";
import UserService from "../../services/user";

const queries = {
	login: async (_: any, payload: IUserToken) => {
		const token = await UserService.getUserToken(payload);
		return token;
	},
};


const mutations = {
	createUser: async (_: any, payload: IUser) => {
		const user = await UserService.createUser(payload);
		return user.id;
	},
};

export const resolvers = { queries, mutations };
