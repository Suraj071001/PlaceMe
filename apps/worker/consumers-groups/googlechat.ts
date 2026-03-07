import axios from "axios";
import redisClient from "@repo/redis-config/redisClient";
import { STREAM_ID as JOB_STREAM_ID } from "@repo/redis-config/STREAM";
import client from "@repo/db";

const GOOGLE_CHAT_CONSUMERGROUP_ID = "google-chat";

interface GoogleWebhookConfig {
  webhookUrl?: string;
}

export async function webhook(
  { webhookUrl }: GoogleWebhookConfig,
  data: string,
) {

  if(!webhookUrl) return;
  const url = webhookUrl;
  const response = await axios({
    url,
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    data: {
      text: data,
    },
  });

  return response;
}

async function processMessage(message: any) {
  const fields = message.message;

  const jobId = fields.jobId as string | undefined;
  if (!jobId) {
    console.warn("JOB_STREAM message missing jobId field", { fields });
    return;
  }

  const job = await client.job.findUnique({
    where: { id: jobId },
    include: {
      company: true,
      department: true,
      batches: {
        include: {
          googleChatConfigs: {
            where: {
              isActive: true,
            },
          },
        },
      },
    },
  });

  if (!job) {
    console.warn("Job not found for jobId from stream", { jobId });
    return;
  }

  if (!job.google_chat) {
    console.info("Google Chat notifications disabled for job, skipping", { jobId });
    return;
  }

  if (!job.batches || job.batches.length === 0) {
    console.info(
      "Job has no batches configured, skipping Google Chat notification",
      {
        jobId,
      },
    );
    return;
  }

  const textParts: string[] = [];
  textParts.push(`New job posted: ${job.title}`);
  textParts.push(`Role: ${job.role}`);
  textParts.push(`Company: ${job.company.name}`);
  if (job.department?.name) {
    textParts.push(`Department: ${job.department.name}`);
  }
  if (job.description) {
    textParts.push("");
    textParts.push(job.description);
  }

  const text = textParts.join("\n");

  for (const batch of job.batches) {

      await webhook(
        {
          webhookUrl: batch.googleChatConfigs?.webhookUrl,
        },
        text,
      );

  }
}

export async function Main() {
  const WorkerId = 1;

  try {
    await redisClient.xGroupCreate(JOB_STREAM_ID, GOOGLE_CHAT_CONSUMERGROUP_ID, "$", {
      MKSTREAM: true,
    });
  } catch (err: any) {
    const message = String(err?.message ?? "");
    if (!message.includes("BUSYGROUP")) {
      console.error("Failed to create google-chat consumer group", err);
      throw err;
    }
  }

  while (1) {
    const response = (await redisClient.xReadGroup(
      GOOGLE_CHAT_CONSUMERGROUP_ID,
      `Worker-${WorkerId}`,
      {
        key: JOB_STREAM_ID,
        id: ">", // message not deliverd to other consumer so far
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
        await redisClient.xAck(
          JOB_STREAM_ID,
          GOOGLE_CHAT_CONSUMERGROUP_ID,
          message.id,
        );
      } catch (err) {
        console.error("Failed to process JOB_STREAM message", err);
      }
    }
  }
}
