// POST /tickets/
export type CreateTicketPayload = {
    name: string
    email: string
    subject: string
    message: string
    phone: string
    orderNumber?: string;
    acceptPolicy: boolean
    user_id?: number | null
}

// response of POST /tickets/
export type CreateTicketResponse = {
    id: number
    status: string
    message: string
}

