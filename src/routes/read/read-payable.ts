import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";

export async function readPayable(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/integrations/payable/:id',{
    schema:{
      params: z.object({
        id: z.string().uuid()
      }),
      response:{
        200: z.object({
          message: z.string(),
          value: z.number(),
          emission: z.date(),
          assignor: z.string().uuid(),
        }),
        404: z.object({
          message: z.string(),
        }),
      }
    }
  }, async (request, reply) => {
      const { id } = request.params

      const payable = await prisma.recebivel.findFirst({
        where:{
          id
        }
      })
      if(payable === null){
        return reply.status(404).send({message: 'Payable not found'})
      }
      return reply.status(200).send({
        message: 'Payable found',
        value: payable.value,
        emission: payable.emissionDate,
        assignor: payable.cedentId
      })
  })
}