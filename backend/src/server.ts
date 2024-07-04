import fastify from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider} from 'fastify-type-provider-zod'
import { createPayable } from './routes/create/create-payable.js'
import { createCedent } from './routes/create/create-cedent.js'
import { readPayable } from './routes/read/read-payable.js'
import { readAssignor } from './routes/read/read-cedent.js'
import { deletePayable } from './routes/delete/delete-payable.js'
import { deleteCedent } from './routes/delete/delete-cedent.js'
import fastifyJwt from '@fastify/jwt'
import { z } from 'zod'
import { createUser, getUser, deleteUser, updateUser, getUsers } from './routes/login/login.js'
import { prisma } from './lib/prisma.js'

const app = fastify({ logger: true })
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyJwt, {
  secret: 'aproveme', // Use uma chave secreta segura
});

app
.withTypeProvider<ZodTypeProvider>()
.post('/integrations/auth',{
  schema:{
    body: z.object({
      login: z.string().max(30),
      password: z.string().max(30),
    }),
    response:{
      200: z.object({
        token: z.string()
      }),
      401: z.object({
        message: z.string()
      }),
    }
  }
}, async (request, reply) => {
  const { login, password } = request.body;
  const user = await prisma.user.findFirst({
    where:{
      email: login,
    }
  })
  if(user === null){
    return reply.status(401).send({ message: 'Usuário não cadastrado!' });
  }
  if(user.password !== password){
    return reply.status(401).send({ message: 'Senha inválida!' });
  }
  const token = app.jwt.sign({ login }, { expiresIn: '1m' });
  return reply.send({ token });
});

// Middleware de autenticação
app.addHook('onRequest', async (request, reply) => {
  // Rotas que não requerem autenticação
  const openRoutes = [
    '/integrations/auth',
    '/integrations/user'
  ];
  // Verifica se a rota atual começa com uma das rotas abertas
  const isRouteOpen = openRoutes.some(route => request.url.startsWith(route));

  if (!isRouteOpen) {
    try {
      await request.jwtVerify();
    } catch (err) {
      return reply.status(401).send({ message: 'Não autorizado' });
    }
  }
});

app.register(createUser)
app.register(getUser)
app.register(getUsers)
app.register(deleteUser)
app.register(updateUser)
app.register(createPayable)
app.register(createCedent)
app.register(readPayable)
app.register(readAssignor)
app.register(deletePayable)
app.register(deleteCedent)

app.listen({port: 3333}).then(() => {
  console.log('app running on port 3333')
})