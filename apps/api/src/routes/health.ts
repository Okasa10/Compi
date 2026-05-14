
const healthRoute = {
  method: 'GET',
  url: '/health',
  handler: async () => ({ status: 'ok' })
}

export default healthRoute