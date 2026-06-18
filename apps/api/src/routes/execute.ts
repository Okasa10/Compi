import { FastifyInstance } from "fastify";

const executionRoutes = async (app:FastifyInstance, options:Object) => {
    app.post('/execute' ,  async (request, reply) => {
        console.log(request.body);
        reply.send("Hello Backend Here");
  })
};

export default executionRoutes;