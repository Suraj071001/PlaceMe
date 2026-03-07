import redisClient from "@repo/redis-config/redisClient";
import { STREAM_ID as JOB_STREAM_ID } from "@repo/redis-config/STREAM";
import client from "@repo/db";
import { Resend } from "resend";

const EMAIL_CONSUMERGROUP_ID = "email";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "placementcell@dsadev.me";

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

async function processMessage(message: {
  id: string;
  message: Record<string, string>;
}) {
  const fields = message.message;

  const jobId = fields.jobId as string | undefined;
  if (!jobId) {
    console.warn("JOB_STREAM message missing jobId field for email worker", {
      fields,
    });
    return;
  }

  const job = await client.job.findUnique({
    where: { id: jobId },
    include: {
      company: true,
      department: true,
      batches: {
        include: {
          students: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  if (!job) {
    console.warn("Job not found for jobId from stream in email worker", { jobId });
    return;
  }

  if (!job.email) {
    console.info("Email notifications disabled for job, skipping", { jobId });
    return;
  }

  const recipientSet = new Set<string>();

  for (const batch of job.batches) {
    for (const student of batch.students) {
      const email =
        (student as any).email ?? // Student.email (nullable)
        (student as any).user?.email; // fallback to User.email
      if (email) {
        recipientSet.add(email);
      }
    }
  }

  const recipients = Array.from(recipientSet);

  if (recipients.length === 0) {
    console.info("No recipients found for job email notification", { jobId });
    return;
  }

  const subject = `New job: ${job.role} at ${job.company.name}`;

  const lines: string[] = [];
  lines.push(`Role: ${job.role}`);
  lines.push(`Company: ${job.company.name}`);
  if (job.department?.name) {
    lines.push(`Department: ${job.department.name}`);
  }
  if ((job as any).location) {
    lines.push(`Location: ${(job as any).location}`);
  }
  if (job.closeAt) {
    lines.push(`Apply before: ${new Date(job.closeAt).toDateString()}`);
  }
  if (job.minimumCGPA != null) {
    lines.push(`Minimum CGPA: ${job.minimumCGPA}`);
  }
  if (job.passingYear != null) {
    lines.push(`Passing year: ${job.passingYear}`);
  }
  lines.push("");
  if (job.description) {
    lines.push(job.description);
  }

  const studentAppBaseUrl = process.env.STUDENT_APP_BASE_URL ?? "http://localhost:3000";
  const applyLink = `${studentAppBaseUrl.replace(/\/$/, "")}/apply/${job.id}`;
  lines.push("");
  lines.push(`Apply here: ${applyLink}`);

  const text = lines.join("\n");

  const batches = chunkArray(recipients, 50);

  for (const recipientBatch of batches) {
    const payload = recipientBatch.map((to) => ({
      from: FROM_EMAIL,
      to: [to],
      subject,
      text,
    }));

    if (!resend) return;
    await resend.batch.send(payload);
  }
}

async function ensureEmailConsumerGroup() {
  try {
    await redisClient.xGroupCreate(JOB_STREAM_ID, EMAIL_CONSUMERGROUP_ID, "$", {
      MKSTREAM: true,
    });
  } catch (err: any) {
    const message = String(err?.message ?? "");
    if (!message.includes("BUSYGROUP")) {
      console.error("Failed to create email consumer group", err);
      throw err;
    }
  }
}

export async function Main() {
  if (!resend) {
    console.warn("Email worker disabled: RESEND_API_KEY is not set");
    return;
  }

  await ensureEmailConsumerGroup();

  const WorkerId = 1;

  while (1) {
    const response = (await redisClient.xReadGroup(
      EMAIL_CONSUMERGROUP_ID,
      `Worker-${WorkerId}`,
      {
        key: JOB_STREAM_ID,
        id: ">",
      },
      {
        COUNT: 1,
        BLOCK: 5000,
      },
    )) as
      | {
          name: string;
          messages: {
            id: string;
            message: Record<string, string>;
          }[];
        }[]
      | null;

    if (!response || response.length === 0) continue;

    const stream = response[0]!;
    for (const message of stream.messages) {
      try {
        await processMessage(message);
        await redisClient.xAck(JOB_STREAM_ID, EMAIL_CONSUMERGROUP_ID, message.id);
      } catch (err) {
        console.error("Failed to process email worker message", err);
      }
    }
  }
}
