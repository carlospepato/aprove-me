import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";

export async function deletePayable(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete("/integrations/payable/:id", {
    schema:{
      params: z.object({
        id: z.string().uuid()
      }),
      response:{
        200: z.object({
          message: z.string(),
          id: z.string().uuid()
        })
      }
    }
  }, async (request, reply) => {
      const { id } = request.params;

      const payable = await prisma.recebivel.findFirst({
        where:{
          id
        }
      });
      if(payable === null){
        return reply.status(404).send({
          message: 'Payable not found',
          id
        })
      }
      await prisma.recebivel.delete({
        where:{
          id
        }
      });

      return reply.status(200).send({
        message: 'Payable deleted',
        id
      });
  });
}