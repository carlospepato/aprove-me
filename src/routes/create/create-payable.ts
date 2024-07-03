import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";

export async function createPayable(app: FastifyInstance) {
  app
  .withTypeProvider<ZodTypeProvider>()
  .post('/integrations/:cedentId/payable',{
    schema:{
      body: z.object({
        value: z.number()
      }),
      params: z.object({
        cedentId: z.string().uuid()
      }),
      response:{
        201: z.object({
          message: z.string(),
          id: z.string().uuid(),
        })
      }
    }
  }, async (request, reply) => {
    const { value } = request.body
    const { cedentId } = request.params

    const payable = await prisma.recebivel.create({
      data:{
        value,
        cedentId
      }
    })
    return reply.status(201).send({message: 'Payable created', id: payable.id})
  })
}

