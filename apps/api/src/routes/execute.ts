const execute = (request, reply) => {
    console.log(request.body);
    reply.send("Code reached backend successfully")
}

export default execute;