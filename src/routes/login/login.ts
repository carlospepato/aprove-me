import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { emit } from "process";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";

export async function createUser(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().post('/integrations/user',{
    schema:{
      params: z.object({
        cedentId: z.string().uuid()
      }),
      body: z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(3),
      }),
      response:{
        201: z.object({
          message: z.string(),
          email: z.string().email(),
        }),
        400: z.object({
          message: z.string(),
          email: z.string().email()
        }),
        404: z.object({
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {
    const { email, password, name } = request.body
    const { cedentId } = request.params

    const userExist = await prisma.user.findFirst({
      where:{
        email
      }
    })

    const cedentExist = await prisma.cedent.findFirst({
      where:{
        id: cedentId
      }
    })
    if(cedentExist === null){
      return reply.status(404).send({
        message: 'Cedent not found',
      })
    }

    if(userExist){
      return reply.status(400).send({
        message: 'User already exists',
        email: userExist.email
      })
    }
    const user = await prisma.user.create({
      data:{
        email,
        password,
        name,
        cedentId
      }
    })

    return reply.status(201).send({
      message: 'User created',
      email: user.email
    })

  })
}

export async function updateUser(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().put('/integrations/user/:id',{
    
  }, async (request, reply) => {

  })
}

export async function deleteUser(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().delete('/integrations/user/:id',{
    
  }, async (request, reply) => {

  })
}

export async function getUser(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().get('/integrations/user',{
    schema:{
      body: z.object({
        email: z.string().email().nullable(),
      }),
      response:{
        200: z.object({
          message: z.string(),
          email: z.string().email().nullable(),
          name: z.string().nullable(),
          users: z.array(z.string().email()).nullable()
        }),
        404: z.object({
          message: z.string(),
          email: z.string().email().nullable(),
          users: z.array(z.string().email()).nullable()
        }),
      }
    }
  }, async (request, reply) => {
    const { email } = request.body
    let user;
    if(!email){
     user = await prisma.user.findMany()
     if(user.length === 0){
       return reply.status(404).send({
          message: 'No users found',
          email,
          users: []
       })
     }
      return reply.status(200).send({
        message: 'Users found',
        email: null,
        name: null,
        users: user.map(user => user.email),
      })
    }
    else{
      user = await prisma.user.findFirst({
        where:{
          email
        }
      })
      if(user === null){
        return reply.status(404).send({
          message: 'User not found',
          email,
          users: []
        })
      }
      return reply.status(200).send({
        message: 'User found',
        email: user.email,
        name: user.name,
        users: []
      })
    }
  })
}