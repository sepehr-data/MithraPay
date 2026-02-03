import { http } from '@/lib/http'
import { endpoints } from '@/types/api_client_types/endpoints.ts'

import type {
    CreateTicketPayload,
    CreateTicketResponse,
} from '@/types/api_client_types/ticket.dto.ts'

// POST /types/tickets/
export async function createTicket(payload: CreateTicketPayload) {
    const { data } = await http.post<CreateTicketResponse>(
        endpoints.tickets.create,
        payload
    )

    return data
}
