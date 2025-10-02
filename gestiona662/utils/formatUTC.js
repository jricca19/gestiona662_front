export function formatUTC(dateStr, pattern = 'dd/MM/yyyy') {
    const date = new Date(dateStr);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const monthNum = String(date.getUTCMonth() + 1).padStart(2, '0');
    const monthShort = date.toLocaleString('es-ES', { month: 'short', timeZone: 'UTC' }).toUpperCase();
    const monthLong = date.toLocaleString('es-ES', { month: 'long', timeZone: 'UTC' });
    const year = date.getUTCFullYear();
    const weekDay = date.toLocaleString('es-ES', { weekday: 'long', timeZone: 'UTC' });
    if (pattern === 'dd/MM/yyyy') return `${day}/${monthNum}/${year}`;
    if (pattern === 'dd') return day;
    if (pattern === 'dd MMM yyyy') return `${day} ${monthShort} ${year}`;
    if (pattern === 'MMMM - yyyy') return `${monthLong.charAt(0).toUpperCase() + monthLong.slice(1)} - ${year}`;
    if (pattern === 'EEEE dd') return `${weekDay} ${day}`;
    return '';
}
