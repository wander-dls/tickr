"use client"
import { useActionState, useEffect } from "react"
import { closeTicket } from "@/actions/ticket.action"
import { toast } from "sonner"

const CloseTicketBitton = ({ ticketId, isClosed }: { ticketId: number; isClosed: boolean }) => {
    const initialState = {
        success: false,
        message: "",
    }
    const [state, formAction ] = useActionState(closeTicket, initialState)


    useEffect(() => {
        if (state.success) {
            toast.success(state.message)
        } else if (state.message && !state.success) {
            toast.error(state.message)
        }
    }, [state])
    if(isClosed) return null

    return (
        <form action={formAction}>
            <input type="hidden" name="ticketId" value={ticketId} />
            <button className="bg-red-500 text-white px-3 w-full rounded hover:bg-red-600 transition py-2" type="submit">Close Ticket</button>
        </form>
    )
}

export default CloseTicketBitton