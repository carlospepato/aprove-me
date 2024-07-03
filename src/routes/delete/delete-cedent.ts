import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";

export async function deleteCedent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete("/integrations/assignor/:id", {
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

      const cedent = await prisma.cedent.findFirst({
        where:{
          id
        }
      });
      if(cedent === null){
        return reply.status(404).send({
          message: 'Cedent not found',
          id
        })
      }
      await prisma.cedent.delete({
        where:{
          id
        }
      });

      return reply.status(200).send({
        message: 'Cedent deleted',
        id
      });
  });
}