import "dotenv/config";
import { Worker } from "bullmq";
import { connection } from "../config/bullmq";
import { spawn } from "child_process";
import path from "path";
const worker = new Worker(
  "containers",
  async (job) => {
    const { language, stdin } = job.data;

    let image = "";
    let dockerArgs: string[] = [];

    switch (language) {
      case "python":
        image = "oj-python";
        dockerArgs = ["python", "Main.py"];
        break;

      case "cpp":
        image = "oj-cpp";
        dockerArgs = ["bash", "-c", "g++ Main.cpp -o main && ./main"];
        break;

      case "java":
        image = "oj-java";
        dockerArgs = ["bash", "-c", "javac Main.java && java Main"];
        break;

      default:
        throw new Error("Unsupported language");
    }

    return await new Promise((resolve) => {
      const filePath = path.resolve(process.env.CODE_DIR!);
      console.log(filePath);
      
      const docker = spawn(
        "sudo",
        [
          "docker",
          "run",
          "--rm",
          "-i",
          "-v",
          `${filePath}:/submission`,
          "-w",
          "/submission",
          image,
          ...dockerArgs,
        ],
        {
          stdio: ["pipe", "pipe", "pipe"],
        },
      );

      let stdout = "";
      let stderr = "";

      docker.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      docker.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      docker.on("error", (err) => {
        resolve({
          success: false,
          id: job.id,
          stdout,
          stderr,
          error: err.message,
        });
      });

      docker.on("close", (code) => {
        resolve({
          success: code === 0,
          id: job.id,
          stdout,
          stderr,
          error: code === 0 ? null : `Container exited with code ${code}`,
        });
      });

      // Pass the user's input to the program
      if (stdin) {
        docker.stdin.write(stdin);
      }

      docker.stdin.end();
    });
  },
  {
    connection,
    concurrency: 5,
  },
);

worker.on("completed", (job, result) => {
  console.log(`${job.id} completed`, result);
});

worker.on("failed", (job, err) => {
  console.log(`${job?.id ?? "unknown"} failed: ${err.message}`);
});

worker.on("error", (err) => {
  console.error("Worker error:", err);
});

worker.on("stalled", (jobId) => {
  console.warn(`Job stalled: ${jobId}`);
});

process.on("SIGINT", async () => {
  await worker.close();
  process.exit(0);
});
