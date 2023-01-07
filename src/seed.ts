import { PrismaClient } from "@prisma/client"
import { format } from "date-fns"

const prisma = new PrismaClient()

async function main() {
    await prisma.user.deleteMany({})
    await prisma.events.deleteMany({})

    const today = new Date()
    
    const sampleEvent = await prisma.events.create({
        data: {
            title: "blah",
            description: "blah",
            startDate: today,
            endDate: today,
            code: 11111
        }
    })

    const sampleEventTwo = await prisma.events.create({
        data: {
            title: "blah",
            description: "blah",
            startDate: today,
            endDate: today,
            code: 22222
        }
    })    

    const createUserAndEvents = await prisma.user.create({
        data: {
            firstName: "john",
            lastName: "murphy",
            email: "jmurphy5613@gmail.com",
        }
    })

    const sampleUserTwo = await prisma.user.create({
        data: {
            firstName: "matt",
            lastName: "fleck",
            email: "cheesy@gmail.com",
        }       
    })

    const addJohnToEvent = await prisma.user.update({
        where: { email: "jmurphy5613@gmail.com" },
        data: {
            eventsAttended: {
                connect: {
                    id: sampleEvent.id,
                }
            }
        }
    })

    const addJohnToEventTwo = await prisma.user.update({
        where: { email: "jmurphy5613@gmail.com" },
        data: {
            eventsAttended: {
                connect: {
                    id: sampleEventTwo.id,
                }
            }
        }
    })
}

main()
    .catch((err) => {
        console.log(err)
    })
    .finally(() => {
        prisma.$disconnect
    })