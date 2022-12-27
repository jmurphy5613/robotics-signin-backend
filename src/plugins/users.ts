import Boom from '@hapi/boom'
import Hapi from '@hapi/hapi'

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
                handler: createUserHandler
            }
        ])
    }
}

const getAllUsersHandler = async (req: Hapi.Request, res: Hapi.ResponseToolkit) => {
    const { prisma } = req.server.app

    try {
        const users = await prisma.user.findMany({})
        return res.response(users).code(200)
    } catch(err) {
        console.log(err)
        return Boom.badImplementation("could not get all users")
    }
}

const createUserHandler = async (req: Hapi.Request, res: Hapi.ResponseToolkit) => {
    const { prisma } = req.server.app
    const body = req.headers

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

export default usersPlugin