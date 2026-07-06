import { FastifyInstance } from "fastify";
import { writeFileSync } from "fs";
import { RunRequest } from "@repo/types";
import { exec } from "child_process";
import { promisify } from "util";
import { executionQueue } from "../config/bullmq";
import { QueueEvents } from "bullmq/dist/esm/classes/queue-events";

const asyncExec = promisify(exec);
const queueEvents = new QueueEvents("containers");

const executionRoutes = async (app: FastifyInstance, options: Object) => {
  const saveCode = async (code: string, language: string, stdin: string) => {
    const CODE_DIR = process.env.CODE_DIR!;

    const extension =
      language === "python" ? "py" : language === "java" ? "java" : "cpp";

    const filePath = `${CODE_DIR}/Main.${extension}`;

    writeFileSync(filePath, code);

    // let command = "";

    // switch (language) {
    //   case "python":
    //     command = `echo ${stdin} | python ${filePath} `;
    //     break;

    //   case "java":
    //     command = `javac ${filePath} && echo "${stdin}" | java -cp ${CODE_DIR} Main`;
    //     break;

    //   case "cpp":
    //     command = `g++ ${filePath} -o ${CODE_DIR}/main && echo "${stdin}" | ${CODE_DIR}/main`;
    //     break;
    // }

    // const { stdout, stderr } = await asyncExec(command);

    // if (stderr) {
    //   throw new Error(stderr);
    // }

    // return stdout;
  };

  const scheduleJob = async (code: string, language: string, stdin: string) => {
    const job = await executionQueue.add(
      "containers",
      {
        code: code,
        language: language,
        stdin: stdin,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      },
    );

    queueEvents.on("waiting", ({ jobId }) => {
      console.log(`A job with ID ${jobId} is waiting`);
    });

    queueEvents.on("active", ({ jobId, prev }) => {
      console.log(`Job ${jobId} is now active; previous status was ${prev}`);
    });

    queueEvents.on("completed", ({ jobId, returnvalue }) => {
      console.log(`${jobId} has completed and returned ${returnvalue}`);
    });

    queueEvents.on("failed", ({ jobId, failedReason }) => {
      console.log(`${jobId} has failed with reason ${failedReason}`);
    });

    process.on("SIGINT", async () => {
      await queueEvents.close();
    });
    return job;
  };

  app.post<{ Body: RunRequest }>("/execute", async (request, reply) => {
    const { code, language, stdin } = request.body;

      await saveCode(code, language, stdin);

    const job = await scheduleJob(code, language, stdin);

    reply.send({
      message: "Job Added to Queue successfully!!!",
      jobId: job.id,
    });
  });
};

export default executionRoutes;
