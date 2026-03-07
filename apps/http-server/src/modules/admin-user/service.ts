import {
    createAdminUserDAO,
    getAdminUsersDAO,
    getAdminUserByIdDAO,
    updateAdminUserDAO,
    deleteAdminUserDAO
} from "./dao";

export const createAdminUserService = async (data: any) => {
    return await createAdminUserDAO(data);
};

export const getAdminUsersService = async () => {
    return await getAdminUsersDAO();
};

export const getAdminUserByIdService = async (id: string) => {
    return await getAdminUserByIdDAO(id);
};

export const updateAdminUserService = async (id: string, data: any) => {
    return await updateAdminUserDAO(id, data);
};

export const deleteAdminUserService = async (id: string) => {
    return await deleteAdminUserDAO(id);
};
