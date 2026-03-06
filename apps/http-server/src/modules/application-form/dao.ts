import client from "@repo/db/index";
import type { CreateApplicationFormPayload, UpdateApplicationFormPayload } from "@repo/zod";

export const createApplicationForm = async (data: CreateApplicationFormPayload) => {
    return await client.applicationForm.create({
        data,
    });
};

export const getApplicationForms = async (
    skip: number,
    take: number,
    filters: any = {}
) => {
    const where: any = {};

    if (filters.departmentId) {
        where.departmentId = filters.departmentId;
    }

    const [data, total] = await Promise.all([
        client.applicationForm.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: { department: true },
            skip,
            take,
        }),
        client.applicationForm.count({ where }),
    ]);

    return { data, total };
};

export const getApplicationFormById = async (id: string) => {
    return await client.applicationForm.findUnique({
        where: { id },
        include: {
            department: true,
            sections: {
                orderBy: { order: "asc" },
                include: {
                    questions: {
                        orderBy: { order: "asc" },
                        include: {
                            options: true,
                        },
                    },
                },
            },
        },
    });
};

export const updateApplicationFormDeep = async (
    id: string,
    data: UpdateApplicationFormPayload
) => {
    const { sections, ...formMeta } = data;

    return await client.$transaction(async (tx) => {
        // Update core metadata
        const updatedForm = await tx.applicationForm.update({
            where: { id },
            data: formMeta,
        });

        // If sections are provided, conduct a wipe-and-replace for deep sync
        // This is the cleanest approach for builder UIs allowing arbitrary add/remove/reorder
        if (sections) {
            // 1. Wipe existing sections (Cascade deletes questions and options)
            await tx.formSection.deleteMany({
                where: { formId: id },
            });

            // 2. Insert new sections, questions, and options
            for (const section of sections) {
                await tx.formSection.create({
                    data: {
                        formId: id,
                        title: section.title,
                        order: section.order,
                        description: section.description,
                        questions: {
                            create: section.questions?.map((question) => ({
                                label: question.label,
                                type: question.type,
                                order: question.order,
                                required: question.required,
                                isPrivate: question.isPrivate,
                                description: question.description,
                                systemNote: question.systemNote,
                                options: question.options && question.options.length > 0
                                    ? {
                                        create: question.options.map((opt) => ({
                                            label: opt.label,
                                            value: opt.value,
                                        })),
                                    }
                                    : undefined,
                            })),
                        },
                    },
                });
            }
        }

        // Return the deeply hydrated form
        return await tx.applicationForm.findUnique({
            where: { id },
            include: {
                sections: {
                    orderBy: { order: "asc" },
                    include: {
                        questions: {
                            orderBy: { order: "asc" },
                            include: {
                                options: true,
                            },
                        },
                    },
                },
            },
        });
    });
};

export const deleteApplicationForm = async (id: string) => {
    return await client.applicationForm.delete({
        where: { id },
    });
};
