export function formatToUserTimezone(date: Date, timezone: string): string {
    return new Intl.DateTimeFormat('vi-VN', {
        timeZone: timezone,
        dateStyle: 'full',
        timeStyle: 'short',
    }).format(date);
}
