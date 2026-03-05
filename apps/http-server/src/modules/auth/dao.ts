import client from "@repo/db/index";

export const findUserByEmail = async (email: string) => {
  return await client.user.findUnique({
    where: { email },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });
};

export const createUser = async (data: {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}) => {
  const defaultRole = await client.role.findFirst({
    where: { isDefault: true },
  });

  return await client.user.create({
    data: {
      ...data,
      roleId: defaultRole?.id,
    } as any,
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });
};
