import client from "@repo/db/index";

export const findUserByEmail = async (email: string) => {
  return await client.user.findUnique({ where: { email } });
};

export const createUser = async (data: {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: any;
}) => {
  return await client.user.create({ data: data as any });
};
