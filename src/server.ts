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

  if (login === 'aprovame' && password === 'aprovame') {
    const token = app.jwt.sign({ login }, { expiresIn: '1m' });
    return reply.send({ token });
  }

  return reply.status(401).send({ message: 'Credenciais inválidas' });
});

// Middleware de autenticação
app.addHook('onRequest', async (request, reply) => {
  if (request.url !== '/integrations/auth') {
    try {
      await request.jwtVerify();
    } catch (err) {
      return reply.status(401).send({ message: 'Não autorizado' });
    }
  }
});

app.register(createPayable)
app.register(createCedent)
app.register(readPayable)
app.register(readAssignor)
app.register(deletePayable)
app.register(deleteCedent)


app.listen({port: 3333}).then(() => {
  console.log('app running on port 3333')
})