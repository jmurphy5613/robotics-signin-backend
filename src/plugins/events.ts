import Boom from '@hapi/boom'
import Hapi from '@hapi/hapi'

//validator imports
import { AddEventValidator } from '../utils/validators'
//interface imports
import { AddEvent } from '../utils/interfaces'

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
                handler: createEventHandler,
                options: {
                    validate: {
                        payload: AddEventValidator
                    }
                }

            },
            {
                method: 'GET',
                path: '/events/get-by-id/{id}',
                handler: getEventById
            },
            {
                method: 'POST',
                path: '/events/register-by-id/{id}',
                handler: registerForEventById
            }
        ])
    }
}

const getAllEventsHandler = async (req: Hapi.Request, res: Hapi.ResponseToolkit) => {
    const { prisma } = req.server.app

    try {
        const events = await prisma.events.findMany({
            include: {
                attendees: true
            }
        })
        return res.response(events).code(200)
    } catch (err) {
        console.log(err)
        return Boom.badImplementation("could not get all events")
    }
}

const createEventHandler = async (req: Hapi.Request, res: Hapi.ResponseToolkit) => {
    const { prisma } = req.server.app
    const payload = req.payload as AddEvent
    try {
        const event = await prisma.events.create({
            data: {
                startDate: payload.startDate,
                endDate: payload.endDate,
                title: payload.title,
                code: payload.code,
                description: payload.description
            }
        })
        return res.response(event).code(200)
    } catch (err) {
        console.log(err)
        return Boom.badImplementation("could not create event")
    }
}

const getEventById = async (req: Hapi.Request, res: Hapi.ResponseToolkit) => {
    const { prisma } = req.server.app
    const id = JSON.parse(req.params.id)

    try {
        const event = await prisma.events.findFirstOrThrow({ 
            where: { 
                id: id 
            }, 
            include: { 
                attendees: true 
            }
        })
        return res.response(event).code(200)
    } catch (err) {
        console.log(err)
        return Boom.badImplementation("could not get that event")
    }
}

const registerForEventById = async (req: Hapi.Request, res: Hapi.ResponseToolkit) => {

}


export default eventsPlugin