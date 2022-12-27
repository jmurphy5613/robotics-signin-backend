import Boom from '@hapi/boom'
import Hapi, { server } from '@hapi/hapi'

const eventsPlugin = {
    name: 'app/events',
    dependencies: ['prisma'],
    register: async function(server: Hapi.Server) {
        server.route([
            {
                method: 'GET',
                path: '/events/get-all',
                handler: getAllEventsHandler
            },
            {
                method: 'POST',
                path: '/events/create',
                handler: createEventHandler
            }
        ])
    }
}

const getAllEventsHandler = async (req: Hapi.Request, res: Hapi.ResponseToolkit) => {
    const { prisma } = req.server.app

    try {
        const events = await prisma.events.findMany({})
        return res.response(events).code(200)
    } catch (err) {
        console.log(err)
        return Boom.badImplementation("could not get all events")
    }
}

const createEventHandler = async (req: Hapi.Request, res: Hapi.ResponseToolkit) => {
    const { prisma } = req.server.app
    const body = req.headers

    try {
        const event = await prisma.events.create({
            data: {
                startDate: body.startDate,
                endDate: body.endDate,
                title: body.title,
                code: body.code
            }
        })
        return res.response(event).code(200)
    } catch (err) {
        console.log(err)
        return Boom.badImplementation("could not create event")
    }
}


export default eventsPlugin