function getUnixTimeAtHour(hour, minute) {
    const now = new Date();
    const departure = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, hour, minute, 0);
    return Math.floor(departure.getTime() / 1000);
}
export { getUnixTimeAtHour };
