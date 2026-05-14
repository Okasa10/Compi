import Fastify from 'fastify'
import execute from './routes/execute'
import corsPlugin from './plugins/cors'
const app = Fastify({ logger: true })


async function main() { 
  await app.register(corsPlugin);
  app.listen({ port: 3001 }, (err) => {
  if (err) throw err
})
}
main();

app.get('/health', async () => ({ status: 'ok' }))
app.post('/execute' , execute);



