import Joi from "@hapi/joi"

export const AddEventValidator = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    title: Joi.string().required(),
    code: Joi.number().required(),
    description: Joi.string().required()
})

export const AddUserValidator = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required()
})