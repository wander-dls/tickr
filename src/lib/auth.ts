import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { logEvent } from "@/utils/sentry"

const secret = new TextEncoder().encode(process.env.AUTH_SECRET)
const cookieName = "auth-token"

// Encrypt the auth token
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function signAuthToken(payload: any) {
    try {
        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("7d")
            .sign(secret)
            
        return token
    } catch (error) {
       logEvent("Error signing auth token", "auth", {payload}, "error", error)
        throw new Error("Error signing auth token")
    }
}

// Decrypt the auth token
export async function verifyAuthToken<T>(token: string): Promise<T> {
    try {
        const { payload } = await jwtVerify(token, secret)

        return payload as T

    } catch (error) {
        logEvent("Error verifying auth token", "auth", {tokenSnippet: token.slice(0, 10)}, "error", error)
        throw new Error("Error verifying auth token")
    }
}

// Set the auth cookie
export async function setAuthCookie(token: string) {
    try {
        const cookieStore = await cookies()
        cookieStore.set(cookieName, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })
    } catch (error) {
        logEvent("Error setting auth cookie", "auth", {token}, "error", error)
    }
}

// Get the auth cookie

export async function getAuthCookie() {
    const cookieStore = await cookies()
    const token = cookieStore.get(cookieName)

    return token?.value
}

// Delete the auth cookie
export async function deleteAuthCookie() {
    try {
        const cookieStore = await cookies()
        cookieStore.delete(cookieName)
    } catch (error) {
        logEvent("Error deleting auth cookie", "auth", {}, "error", error)
    }
}