import { FastifyInstance } from "fastify";
import { request } from "http";


const loginRoutes = async (app: FastifyInstance, options: Object) => {
    app.get("/login/github", async (request, reply) => {
        const CLIENT_ID = process.env.CLIENT_ID;
        console.log(CLIENT_ID);
        
    reply.redirect(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`, 303);
  });

    app.get("/login/github/callback", async (request, reply) => {
        const { code } = request.params;
    console.log(code);
  });
};

export default loginRoutes;
