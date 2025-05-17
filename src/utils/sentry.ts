import * as Sentry from '@sentry/nextjs'

type LogLevel = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug' 


export const logEvent = (
    message: string,
    category: string = 'general',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: Record<string, any>,
    level: LogLevel = 'info',
    error?: unknown
) => {
    Sentry.addBreadcrumb({
        category,
        message,
        level,
        data,
    })

    if (error) {
        Sentry.captureException(error)
    } else {
        Sentry.captureMessage(message, level)
    }
}