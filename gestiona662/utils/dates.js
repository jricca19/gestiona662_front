export function formatoFecha(dateStr, pattern = 'dd/MM/yyyy') {
    const date = new Date(dateStr);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const monthNum = String(date.getUTCMonth() + 1).padStart(2, '0');
    const monthShort = date.toLocaleString('es-ES', { month: 'short', timeZone: 'UTC' }).toUpperCase();
    const monthLong = date.toLocaleString('es-ES', { month: 'long', timeZone: 'UTC' });
    const year = date.getUTCFullYear();
    const weekDay = date.toLocaleString('es-ES', { weekday: 'long', timeZone: 'UTC' });
    if (pattern === 'dd/MM/yyyy') return `${day}/${monthNum}/${year}`;
    if (pattern === 'dd/MM') return `${day}/${monthNum}`;
    if (pattern === 'dd') return day;
    if (pattern === 'dd MMM yyyy') return `${day} ${monthShort} ${year}`;
    if (pattern === 'MMMM - yyyy') return `${monthLong.charAt(0).toUpperCase() + monthLong.slice(1)} - ${year}`;
    if (pattern === 'EEEE dd') return `${weekDay} ${day}`;
    return '';
}

export function fechaStringAFechaUTC(isoDateStr) {
    const [year, month, day] = isoDateStr.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
}

export function fechaAStringISO(d) {
    if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    const date = new Date(d);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function fechaStringALocalDate(isoDateStr) {
    if (typeof isoDateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(isoDateStr)) {
        return new Date();
    }
    const [year, month, day] = isoDateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
}

export function formatoFechaDDMMYYYY(dateStr) {
    let year, month, day;
    if (dateStr.includes('T')) {
        const d = new Date(dateStr);
        year = d.getFullYear();
        month = String(d.getMonth() + 1).padStart(2, '0');
        day = String(d.getDate()).padStart(2, '0');
    } else {
        [year, month, day] = dateStr.split('-');
    }
    return `${day}/${month}/${year}`;
}

export function contarDiasLaborales(startDate, endDate) {
    const [ys, ms, ds] = startDate.split('-').map(Number);
    const [ye, me, de] = endDate.split('-').map(Number);
    const start = new Date(Date.UTC(ys, ms - 1, ds));
    const end = new Date(Date.UTC(ye, me - 1, de));
    let count = 0;
    for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
        const wd = d.getUTCDay();
        if (wd >= 1 && wd <= 5) count++;
    }
    return count;
};

