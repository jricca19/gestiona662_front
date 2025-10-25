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

export function fechaLocalFromISO(isoDateStr) {
    // isoDateStr: "YYYY-MM-DD"
    const [year, month, day] = isoDateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
}

export function soloFecha(fecha) {
    return fecha.toISOString().split('T')[0];
}

export function esFinDeSemana(d) {
    const day = d.getUTCDay();
    console.log('Día de la semana (UTC):', day);
    return day === 0 || day === 6;
};

export function contarDiasLaborales(start, end) {
    const s = new Date(start);
    const e = new Date(end);
    let count = 0;
    for (let d = new Date(s); d <= e; d.setUTCDate(d.getUTCDate() + 1)) {
        const day = d.getUTCDay();
        if (day >= 1 && day <= 5) count++;
    }
    return count;
};

export function dateToISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
