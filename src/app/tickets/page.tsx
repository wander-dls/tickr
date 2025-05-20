import { getTickets } from "@/actions/ticket.action"
import Link from "next/link"
import { getCurrentUser } from "@/lib/current-user"
import { redirect } from "next/navigation"
import TicketItem from "@/components/TicketItem"



const TicketsPage = async () => {
    const user = await getCurrentUser()
    if (!user) {
        redirect("/login")
    }
    const tickets = await getTickets()

    return (
      <div className="min-h-screen bg-blue-50 p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">Support Tickets</h1>
        {tickets.length === 0 ? (
            <p>
                No tickets found.{" "}
                <Link href="/tickets/new" className="text-blue-600 underline">
                    Create a new ticket
                </Link>
            </p>
        ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
                {tickets.map((ticket) => (
                    <TicketItem ticket={ticket} key={ticket.id} />
                ))}
            </div>
            )}
      </div>
    )
  }
  export default TicketsPage