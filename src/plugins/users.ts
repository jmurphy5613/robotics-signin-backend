import Boom from '@hapi/boom'
import Hapi from '@hapi/hapi'

//validator imports
import { AddUserValidator } from '../utils/validators'
//interface imports
import { AddUser } from '../utils/interfaces'

const usersPlugin = {
    name: 'app/users',
    dependencies: ['prisma'],
    register: async function(server: Hapi.Server) {
        server.route([
            {
                method: 'GET',
                path: '/users/get-all',
                handler: getAllUsersHandler
            },
            {
                method: 'POST',
                path: '/users/create',
                handler: createUserHandler,
                options: {
                    validate: {
                        payload: AddUserValidator
                    }
                }
            },
            {
                method: 'GET',
                path: '/users/get-by-email/{email}',
                handler: getUserByEmail
            },
            {
                method: 'POST',
                path: '/users/register-by-ids/{userId}/{eventId}',
                handler: registerForEventByIds
            },
            {
                method: 'POST',
                path: '/users/unregister-by-ids/{userId}/{eventId}',
                handler: unregisterForEventByIds
            }
        ])
    }
}

const getAllUsersHandler = async (req: Hapi.Request, res: Hapi.ResponseToolkit) => {
    const { prisma } = req.server.app

    try {
        const users = await prisma.user.findMany({
            include: {
                eventsAttended: true
            }
        })
        return res.response(users).code(200)
    } catch(err) {
        console.log(err)
        return Boom.badImplementation("could not get all users")
    }
}

const createUserHandler = async (req: Hapi.Request, res: Hapi.ResponseToolkit) => {
    const { prisma } = req.server.app
    const body = req.payload as AddUser

    try {
        const create = await prisma.user.create({
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email
            }
        })
        return res.response(create).code(200)
    } catch(err) {
        console.log(err)
        return Boom.badImplementation("could not create user")
    }
}

const getUserByEmail = async (req: Hapi.Request, res: Hapi.ResponseToolkit) => {
    const { prisma } = req.server.app
    const email = req.params.email

    try {
        const user = await prisma.user.findFirst({ where: { email: email } })
        if(!user) {
            return res.response({ message: "user doesn't exist" })
        }
        return res.response(user).code(200)
    } catch(err) {
        console.log(err)
        return Boom.badImplementation("can't find user")
    }
}

const registerForEventByIds = async (req: Hapi.Request, res: Hapi.ResponseToolkit) => {
    const { prisma } = req.server.app
    const eventId = JSON.parse(req.params.eventId)
    const userId = JSON.parse(req.params.userId)

    console.log(`Sigin detected: User: ${userId}, Event: ${eventId} Time: ${Date.now()}`)

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                eventsAttended: {
                    connect: {
                        id: eventId
                    }
                }
            }
        })
        return res.response().code(200)
    } catch(err) {
        console.log(err)
        return Boom.badImplementation("could not register for event")
    }
}

const unregisterForEventByIds = async (req: Hapi.Request, res: Hapi.ResponseToolkit) => {
    const { prisma } = req.server.app
    const eventId = JSON.parse(req.params.eventId)
    const userId = JSON.parse(req.params.userId)

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                eventsAttended: {
                    disconnect: {
                        id: eventId
                    }
                }
            }
        })
        return res.response().code(200)
    } catch(err) {
        console.log(err)
        return Boom.badImplementation("could not disconnect user")
    }
}

export default usersPlugin