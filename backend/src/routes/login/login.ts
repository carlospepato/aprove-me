import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";

export async function createUser(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().post('/integrations/user/:cedentId',{
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
      querystring: z.object({
        email: z.string().email(),
      }),
      response:{
        200: z.object({
          message: z.string(),
          email: z.string().email(),
          name: z.string(),
        }),
        404: z.object({
          message: z.string(),
          email: z.string().email().nullable(),
        }),
      }
    }
  }, async (request, reply) => {
    const { email } = request.query
    let user;

    user = await prisma.user.findFirst({
      where:{
        email
      }
    })
    if(user === null){
      return reply.status(404).send({
        message: 'User not found',
        email
      })
    }
    return reply.status(200).send({
      message: 'User found',
      email: user.email,
      name: user.name
    })
  })
}

export async function getUsers(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().get('/integrations/users',{
    schema:{
      response:{
        200: z.object({
          message: z.string(),
          users: z.array(z.object({
            email: z.string().email(),
            name: z.string(),
          }))
        }),
        404: z.object({
          message: z.string(),
        }),
      }
    }
  }, async (request, reply) => {
    
    const users = await prisma.user.findMany()
    if(users.length === 0){
      return reply.status(404).send({
        message: 'Users not found',
      })
    }
    return reply.status(200).send({
      message: 'Users found',
      users
    })
   

    
  })
}