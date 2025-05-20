"use server"

import { prisma } from "@/db/prisma"
import { revalidatePath } from "next/cache";
import { logEvent } from "@/utils/sentry";
import { getCurrentUser } from "@/lib/current-user"

export async function createTicket(prevState: {success: boolean; message: string}, formData: FormData): Promise<{ success: boolean; message: string }> {
    
  

    try {
        // Get the current user
        const user = await getCurrentUser()
        if (!user) {
            logEvent('User not authenticated', 'ticket', {}, 'warning')
            return { success: false, message: "User not authenticated" }
        }

        // Extract form data
        const subject = formData.get("subject") as string
        const description = formData.get("description") as string
        const priority = formData.get("priority") as string
    
        // Validate the form data
        if (!subject || !description || !priority) {
        logEvent('Validation Error: Missing ticket fields', 'ticket', {
            subject,
            description,
            priority,
        }, 'warning')
        return { success: false, message: "All fields are required" }
    }

        // Create the ticket in the database
        const ticket = await prisma.ticket.create({
            data: {
                subject,
                description,
                priority,
                user: {
                    connect: { id: user.id }, 
                },
            },
        })

        
        // Log the ticket creation event
        logEvent(`Ticket Created Successfully: ${ticket.id}`, 'ticket', {ticketId: ticket.id}, 'info')

        // Revalidate the path to update the cache
        revalidatePath("/tickets")

        // Return success message
    return { success: true, message: "Ticket created successfully" }
    } catch (error) {
        logEvent('Error creating ticket', 'ticket', {
            formData: Object.fromEntries(formData.entries()),
        }, 'error', error)

        // Handle the error (e.g., log it, return an error message)
        return { success: false, message: "An error occured while creating the ticket" }
    }
}

export async function getTickets(){
    try {
        const user = await getCurrentUser()
        if (!user) {
            logEvent('Unauthorized access to ticket list', 'ticket', {}, 'warning')
            return []
        }
        const tickets = await prisma.ticket.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        })
        logEvent('Fetched tickets successfully', 'ticket', {count: tickets.length}, 'info')

        return tickets

    } catch (error) {

        // Handle the error (e.g., log it, return an error message)
        logEvent('Error fetching tickets', 'ticket', {}, 'error', error)

        return []
        
    }
}

export async function getTicketById(id: string) {
    try {
        const ticket = await prisma.ticket.findUnique({
            where: { id: Number(id) },
        })

        if (!ticket) {
            logEvent(`Ticket not found`, 'ticket', {ticketId: id}, 'warning')

        }

        // logEvent(`Fetched ticket successfully: ${id}`, 'ticket', {ticketId: id}, 'info')

        return ticket
    } catch (error) {
        logEvent('Error fetching ticket details', 'ticket', {ticketId: id}, 'error', error)

        return null
    }
}

// close ticket
export async function closeTicket(prevState: {success: boolean; message: string}, formData: FormData): Promise<{success: boolean; message: string}> {
    const ticketId = Number(formData.get("ticketId"))

    if (!ticketId) {
        logEvent('Validation Error: Missing ticket ID', 'ticket', {}, 'warning')
        return { success: false, message: "Ticket ID is required" }
    }

    const user = await getCurrentUser()
    if (!user) {
        logEvent('Validation Error: Missing user ID', "ticket", {}, 'warning')
        return { success: false, message: "User not authenticated" }
    }
    const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
    })
    if (!ticket || ticket.userId !== user.id) {
        logEvent('Unauthorized ticket close attemp', 'ticket', {ticketId, userId: user.id}, 'warning')
        return { success: false, message: "TYou are not authorized to close this ticket" }
    }
    await prisma.ticket.update({
        where: { id: ticketId },
        data: { status: "CLOSED" },
    })
    revalidatePath("/tickets")
    revalidatePath(`/tickets/${ticketId}`)
    logEvent(`Ticket closed successfully: ${ticketId}`, 'ticket', {ticketId}, 'info')
    return { success: true, message: "Ticket closed successfully" }
}