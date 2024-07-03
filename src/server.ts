import fastify from 'fastify'
import { serializerCompiler, validatorCompiler} from 'fastify-type-provider-zod'
import { createPayable } from './routes/create-payable.js'
import { createCedent } from './routes/create-cedent.js'

const app = fastify({ logger: true })
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createPayable)
app.register(createCedent)


app.listen({port: 3333}).then(() => {
  console.log('app running on port 3333')
})