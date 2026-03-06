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

export const createOTP = async (email: string, otp: string) => {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
  return await client.oTP.create({
    data: {
      email,
      otp,
      expiresAt,
    },
  });
};

export const verifyOTP = async (email: string, otp: string) => {
  const record = await client.oTP.findFirst({
    where: {
      email,
      otp,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (record) {
    // Optional: burn the OTP after successful verification
    await client.oTP.deleteMany({ where: { email } });
  }

  return record;
};

export const activateUserAndSetPassword = async (email: string, hashedPassword: string) => {
  return await client.user.update({
    where: { email },
    data: {
      isActive: true,
      password: hashedPassword,
    },
    include: {
      role: {
        include: {
          permissions: {
            include: { permission: true },
          },
        },
      },
    },
  });
};
