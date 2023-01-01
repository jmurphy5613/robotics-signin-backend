export interface AddEvent {
    startDate: Date,
    endDate: Date,
    title: string,
    code: number,
    description: string
}

export interface AddUser {
    firstName: string,
    lastName: string,
    email: string
}