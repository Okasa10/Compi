import Fastify from "fastify";
import corsPlugin from "./plugins/cors";
import executionRoutes from "./routes/execute";
import { config } from "dotenv";
import loginRoutes from "./routes/login";
const app = Fastify({ logger: true });
config();

async function main() {
  // console.log(process.cwd());

  await app.register(corsPlugin);
  app.listen({ port: 3002 }, (err) => {
    if (err) throw err;
  });
}
main();

app.register(executionRoutes);
app.register(loginRoutes);

app.get("/health", async (request, reply) =>
  reply.send("Health status: Running"),
);
