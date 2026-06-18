import Fastify from 'fastify'
import corsPlugin from './plugins/cors'
import executionRoutes from './routes/execute';
const app = Fastify({ logger: true })


async function main() { 
  await app.register(corsPlugin);
  app.listen({ port: 3002 }, (err) => {
  if (err) throw err
})
}
main();

app.register(executionRoutes);
app.get('/health', async () => ({ status: 'Badhiya' }))



