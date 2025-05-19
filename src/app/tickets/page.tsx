import { getTickets } from "@/actions/ticket.action"
// import { logEvent } from "@/utils/sentry"
import Link from "next/link"
import { getPriorityClass } from "@/utils/ui"
import { getCurrentUser } from "@/lib/current-user"
import { redirect } from "next/navigation"



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
                    <div className="flex justify-between items-center bg-white rounded-lg shadow border border-gray-200 p-6" key={ticket.id}>
                        {/* Left side */}
                            <div>
                                <h2 className="text-xl font-semibold text-blue-600">
                                    {ticket.subject}
                                </h2>
                            </div>
                        {/* RIght side */}
                        <div className="text-right space-y-2">
                            <div className="text-sm text-gray-500">
                                Priority: <span className={getPriorityClass(ticket.priority)}>{ticket.priority}</span>
                            </div>
                            <Link href={`/tickets/${ticket.id}`} className="inline-block mt-2 bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition text-center">View Ticket</Link>
                        </div>
                    </div>
                ))}
            </div>
            )}
      </div>
    )
  }
  export default TicketsPage