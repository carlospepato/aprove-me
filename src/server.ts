import fastify from 'fastify'
import { serializerCompiler, validatorCompiler} from 'fastify-type-provider-zod'
import { createPayable } from './routes/create/create-payable.js'
import { createCedent } from './routes/create/create-cedent.js'
import { readPayable } from './routes/read/read-payable.js'
import { readAssignor } from './routes/read/read-cedent.js'
import { deletePayable } from './routes/delete/delete-payable.js'
import { deleteCedent } from './routes/delete/delete-cedent.js'

const app = fastify({ logger: true })
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createPayable)
app.register(createCedent)
app.register(readPayable)
app.register(readAssignor)
app.register(deletePayable)
app.register(deleteCedent)


app.listen({port: 3333}).then(() => {
  console.log('app running on port 3333')
})