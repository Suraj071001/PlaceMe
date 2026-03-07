import type { Request, Response } from "express";
import {
    createAdminUserService,
    getAdminUsersService,
    getAdminUserByIdService,
    updateAdminUserService,
    deleteAdminUserService
} from "./service";

export const createAdminUserController = async (req: Request, res: Response): Promise<void> => {
    try {
        const adminUser = await createAdminUserService(req.body);
        res.status(201).json({ success: true, data: adminUser });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAdminUsersController = async (req: Request, res: Response): Promise<void> => {
    try {
        const adminUsers = await getAdminUsersService();
        res.status(200).json({ success: true, data: adminUsers });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAdminUserByIdController = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const adminUser = await getAdminUserByIdService(id);
        if (!adminUser) {
            res.status(404).json({ success: false, message: "Admin user not found" });
            return;
        }
        res.status(200).json({ success: true, data: adminUser });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAdminUserController = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const adminUser = await updateAdminUserService(id, req.body);
        res.status(200).json({ success: true, data: adminUser });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteAdminUserController = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        await deleteAdminUserService(id);
        res.status(200).json({ success: true, message: "Admin user deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
