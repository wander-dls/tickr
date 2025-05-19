"use server"

import { prisma } from "@/db/prisma"
import bcrypt from "bcryptjs"
import { logEvent } from "@/utils/sentry"
import { signAuthToken, setAuthCookie, deleteAuthCookie  } from "@/lib/auth"


type ResponseResult = {
    success: boolean;
    message: string;
}

// Register New User
export async function registerUser(preState: ResponseResult, formData: FormData): Promise<ResponseResult> {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
        if (!name || !email || !password) {
            logEvent("Validation Error: Missing fields", "auth", { name, email, password }, "warning") 
            return { success: false, message: "All fields are required" }
        }

        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })
        if (existingUser) {
            logEvent(`Registration failed: User already exists - ${email}`, "auth", { email }, "warning")
            return { success: false, message: "User already exists" }
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create the user in the database
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })

        // Create the auth token
        const token = await signAuthToken({ userId: user.id })
        await setAuthCookie(token)
        logEvent(`User registered successfully: ${email}`, "auth", { userId: user.id, email }, "info")
        
        return { success: true, message: "User registered successfully" }

    } catch (error) {
        logEvent("Error registering user", "auth", {}, "error", error)
        return { success: false, message: "Error registering user" }
    }
}

// Logout User
export async function logoutUser(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
        // Delete the auth cookie
        await deleteAuthCookie();
        logEvent('User logged out successfully', 'auth', {}, 'info');
  
      return { success: true, message: 'Logout Successful' };
    } catch (error) {
      logEvent('Unexpected error during logout', 'auth', {}, 'error', error);
  
      return { success: false, message: 'Logout failed. Please try again' };
    }
  }
  
// Login User
export async function loginUser(preState: ResponseResult, formData: FormData): Promise<ResponseResult> {
    try {
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        if (!email || !password) {
            logEvent("Validation Error: Missing fields", "auth", { email, password }, "warning")
            return { success: false, message: "All fields are required" }
        }

        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user || !user.password) {
            logEvent(`Login failed: User not found - ${email}`, "auth", { email }, "warning")
            return { success: false, message: "Invalid email or password" }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            logEvent(`Login failed: Invalid password`, "auth", { email }, "warning")
            return { success: false, message: "Invalid email or password" }
        }

        // Create the auth token
        const token = await signAuthToken({ userId: user.id })
        await setAuthCookie(token)
        return { success: true, message: "Login successful" }
    } catch (error) {
        logEvent("Error logging in user", "auth", {}, "error", error)
        return { success: false, message: "Error logging in user" }
    }
}