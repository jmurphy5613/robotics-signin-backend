import { PrismaClient } from "@prisma/client"
import { format } from "date-fns"

const prisma = new PrismaClient()

async function main() {
    await prisma.user.deleteMany({})
    await prisma.events.deleteMany({})

    const today = new Date()

    // const createUserAndEvents = await prisma.user.create({
    //     data: {
    //         firstName: "john",
    //         lastName: "murphy",
    //         email: "jmurphy5613@gmail.com",
    //         eventsAttended: {
    //             create: [
    //                 {
    //                     startDate: today,
    //                     endDate: today,
    //                     title: "Robotics Meeting",
    //                     code: 11111
    //                 }
    //             ]
    //         }
    //     }
    // })
}

main()
    .catch((err) => {
        console.log(err)
    })
    .finally(() => {
        prisma.$disconnect
    })