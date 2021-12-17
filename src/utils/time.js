export function formatDateToHuman(timestamp) {
  // convert to UTC
  const d = new Date(timestamp * 1000 + new Date().getTimezoneOffset() * 60 * 1000)
  return `${[
    d
      .getDate()
      .toString()
      .padStart(2, '0'),
    `${(d.getMonth() + 1).toString().padStart(2, '0')}`,
    d.getFullYear(),
  ].join('.')} ${[
    `${d.getHours()}`.padStart(2, '0'),
    `${d.getMinutes()}`.padStart(2, '0'),
    `${d.getSeconds()}`.padStart(2, '0'),
  ].join(':')}`
}

export function getThursdayUTCTimestamp() {
  const ts = new Date().getTime();
  const week = 604800;

  return Math.floor((ts / 1000) / week) * week
}
