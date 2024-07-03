import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

export async function createCedent(app: FastifyInstance) {
  app
  .withTypeProvider<ZodTypeProvider>()
  .post('/integrations/cedent',{
    schema:{
      body: z.object({
        document: z.string().max(30),
        email: z.string().email().max(140),
        phone: z.string().max(20),
        name: z.string().max(140),
      }),
      response:{
        201: z.object({
          message: z.string(),
          email: z.string().email().max(140),
          id: z.string().uuid(),
        }),
        400: z.object({
          message: z.string(),
        }),
      }
    }
  }, async (request, reply) => {
    const {document, email, phone, name} = request.body

    const cedentExists = await prisma.cedent.findFirst({
      where:{
        email
      }
    })

    if(cedentExists !== null){
      return reply.status(400).send({message: 'Cedent already exists'})
    }

    const cedent = await prisma.cedent.create({
      data:{
        document,
        email,
        phone,
        name
      }
    })

    return reply.status(201).send({message: 'Cedent created', email: cedent.email, id: cedent.id})
  })
}

