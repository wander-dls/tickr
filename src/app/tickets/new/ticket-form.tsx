"use client"
import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createTicket } from "@/actions/ticket.action"
import { toast } from "sonner"

const NewTicketForm = () => {
    const [state, formAction] = useActionState(createTicket, {
        success: false,
        message: "",
    })

    const router = useRouter()

    // Redirect to the tickets page after successful ticket creation
   useEffect(() => {
        if (state.success) {
            // Show success message
            toast.success("Ticket created successfully")
            // Redirect to the tickets page after successful ticket creation
            router.push("/tickets")
        }
    }, [state.success, router])
  return (
   
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 border-gray-200">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
                Submit a Support Ticket
            </h1>
            {
                state.message && !state.success && (
                    <p className="text-red-500 mb-4 text-center">
                        {state.message}
                    </p>
                )
            }
            <form className="space-y-4 text-gray-700" action={formAction}>
                <input className="w-full border border-gray-200 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder="Subject" name="subject"  />
                <textarea className="w-full border border-gray-200 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" rows={4} placeholder="Description" name="description" />
                <select name="priority" className="w-full border border-gray-200 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700" defaultValue="low">
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium riority</option>
                    <option value="high">High riority</option>
                </select>
                <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition disabled:opacity-50" type="submit">Submit</button>
            </form>
        </div>
  )
}
export default NewTicketForm