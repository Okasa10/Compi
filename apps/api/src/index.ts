import Fastify from 'fastify'
import corsPlugin from './plugins/cors'
import executionRoutes from './routes/execute';
import { config } from 'dotenv';
const app = Fastify({ logger: true })
config();

async function main() { 
  console.log(process.cwd());
  
  await app.register(corsPlugin);
  app.listen({ port: 3002 }, (err) => {
  if (err) throw err
})
}
main();

app.register(executionRoutes);
app.get('/health', async () => ({ status: 'Badhiya' }))



