export type BookingEmbed = { url: string; origin: string }

export function parseBookingUrl(raw: string | undefined): BookingEmbed | null

export function bookingEmbed(env?: Record<string, string | undefined>): BookingEmbed | null
