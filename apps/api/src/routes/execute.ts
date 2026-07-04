import { FastifyInstance } from "fastify";
import { writeFileSync } from "fs";
import { RunRequest } from "@repo/types";
import { exec } from "child_process";
import { promisify } from "util";

const asyncExec = promisify(exec);

const executionRoutes = async (app: FastifyInstance, options: Object) => {
  const executeCode = async (
    path: string,
    code: string,
    language: string,
    stdin: string,
  ) => {
    const CODE_DIR = process.env.CODE_DIR!;

    const extension =
      language === "python" ? "py" : language === "java" ? "java" : "cpp";

    const filePath = `${CODE_DIR}/Main.${extension}`;

    writeFileSync(filePath, code);

    let command = "";

    switch (language) {
      case "python":
        command = `echo ${stdin} | python ${filePath} `;
        break;

      case "java":
        command = `javac ${filePath} && echo "${stdin}" | java -cp ${CODE_DIR} Main`;
        break;

      case "cpp":
        command = `g++ ${filePath} -o ${CODE_DIR}/main && echo "${stdin}" | ${CODE_DIR}/main`;
        break;
    }

    const { stdout, stderr } = await asyncExec(command);

    if (stderr) {
      throw new Error(stderr);
    }

    return stdout;
  };

  app.post<{ Body: RunRequest }>("/execute", async (request, reply) => {
    const { code, language, stdin } = request.body;

    const response = await executeCode("../codes/main.", code, language, stdin);
    console.log(response);

    app.log.info("Code reached backend succesfully");
    reply.send(response);
  });
};

export default executionRoutes;
