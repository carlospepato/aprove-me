import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export async function readCedent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/integrations/assignor/:id',{

  }, async (request, reply) => {

  })
}