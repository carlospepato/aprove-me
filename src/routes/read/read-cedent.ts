import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";

export async function readAssignor(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/integrations/assignor/:id',{
    schema:{
      params: z.object({
        id: z.string().uuid()
      }),
      response:{
        200: z.object({
          message: z.string(),
          id: z.string(),
          document: z.string(),
          email: z.string(),
          phone: z.string(),
          name: z.string(),
        }),
        404: z.object({
          message: z.string(),
        }),
      }
    }
  }, async (request, reply) => {
      const { id } = request.params

      const cedent = await prisma.cedent.findFirst({
        where:{
          id
        }
      })
      if(cedent === null){
        return reply.status(404).send({message: 'Assignor not found'})
      }
      return reply.status(200).send({
        message: 'Assignor found',
        id: id,
        document: cedent.document,
        email: cedent.email,
        phone: cedent.phone,
        name: cedent.name,
      })
  })
}