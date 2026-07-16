import { FastifyInstance } from "fastify";
import { writeFileSync } from "fs";
import { RunRequest } from "@dsa-compiler/types";
import { executionQueue } from "../config/bullmq";
import { QueueEvents } from "bullmq/dist/esm/classes/queue-events";

const queueEvents = new QueueEvents("containers");

const executionRoutes = async (app: FastifyInstance, options: Object) => {
  const saveCode = async (code: string, language: string) => {
    const CODE_DIR = process.env.CODE_DIR!;

    const extension =
      language === "python" ? "py" : language === "java" ? "java" : "cpp";

    const filePath = `${CODE_DIR}/Main.${extension}`;

    writeFileSync(filePath, code);
  };

  app.post<{ Body: RunRequest }>("/execute", async (request, reply) => {
    const { code, language, stdin } = request.body;
    await saveCode(code, language )
    try {
      const job = await executionQueue.add(
        "containers",
        {
          code:code,
          language:language,
          stdin:stdin,
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 2000,
          },
          removeOnComplete: true,
          removeOnFail: true,
        },
      );

      const result = await job.waitUntilFinished(queueEvents);
      console.log(result);
      return reply.send({
        jobId: job.id,
        ...result,
      });
    } catch (err: any) {
      return reply.status(500).send({
        success: false,
        error: err.message,
      });
    }
  });
};

export default executionRoutes;
