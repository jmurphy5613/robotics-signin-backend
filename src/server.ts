import Hapi from '@hapi/hapi'
import prismaPlugin from './plugins/prisma'
import usersPlugin from './plugins/users'
import eventsPlugin from './plugins/events'

const server: Hapi.Server = Hapi.server({
    port: process.env.PORT || 3001,
    routes: {
        cors: true
    }
})

const start = async ():Promise<Hapi.Server> => {
    await server.start()
    await server.register([prismaPlugin, usersPlugin, eventsPlugin])
    
    console.log(`server running on port ${server.info.uri}`)

    return server
}

process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
})

start()
    .catch((err) => {
        console.log(err)
    })