import { z } from "zod";

export const UpdateStudentProfileSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().optional(),

    enrollment: z.string().min(1, "Enrollment number is required"),
    address: z.string().min(1, "Address is required"),
    skills: z.array(z.string()).optional(),

    // They are relational IDs and generally shouldn't be mutable directly unless needed but for now the UI has "branch" and "batch" string.
    // Realistically they need `branchId` and `batchId` to update relations.
    // The UI doesn't have IDs, just text. We should add inputs for those if necessary, or let them be text fields if we do lookup.
    // Assuming the user form just passes simple strings for now, let's accept them and figure it out.
    // For the moment, let's accept branchId and batchId
    branchId: z.string().optional(),
    batchId: z.string().optional(),
});

export type UpdateStudentProfilePayload = z.infer<typeof UpdateStudentProfileSchema>;
