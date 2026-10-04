import { CalendarCheck } from "lucide-react"
import { Container } from "@/components/ui/container"
import type { BookingEmbed } from "@/lib/ghl-booking.mjs"

/**
 * Debra's GoHighLevel booking calendar, framed on /consultation.
 *
 * Rendered only when `GHL_BOOKING_URL` holds a valid booking link (see
 * lib/ghl-booking.mjs); with none, the page is exactly the message form it was.
 * The same parser feeds the Content Security Policy's `frame-src`, so a
 * calendar that renders here is never blocked by the policy.
 *
 * GoHighLevel's resize script is deliberately not loaded: it would put a
 * third-party script on the public site's policy. The frame gets a fixed
 * height instead and scrolls inside itself if a calendar runs long. A
 * third-party widget is also the part of this page we cannot vouch for with a
 * keyboard or screen reader, so the same calendar is one link away in a tab of
 * its own, and the message form below stays as a complete alternative.
 */
export function BookingCalendar({ booking }: { booking: BookingEmbed }) {
  return (
    <section className="dh-band dh-band-white" aria-labelledby="consultation-calendar-heading">
      <Container>
        <div className="dh-lead">
          <p className="dh-kicker">
            <CalendarCheck aria-hidden="true" />
            Book directly
          </p>
          <h2 id="consultation-calendar-heading">Pick a time that works for you</h2>
          <p>
            Choose an open time on Debra&apos;s calendar and it is booked. Please do not enter Social Security numbers,
            account numbers or other sensitive financial information.
          </p>
        </div>
        <iframe
          src={booking.url}
          title="Debra Allen's consultation booking calendar"
          className="dh-booking-frame"
          loading="lazy"
        />
        <p className="dh-booking-note">
          Calendar not loading, or easier in a full window?{" "}
          <a href={booking.url} target="_blank" rel="noopener noreferrer">
            Open the booking calendar in a new tab
          </a>
          , or send a request with the form below.
        </p>
      </Container>
    </section>
  )
}
