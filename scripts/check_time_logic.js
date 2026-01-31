// Quick check for the time-in-range logic used by src/content.ts
const toM = (t) => t ? (Number(t.split(':')[0]) * 60 + Number(t.split(':')[1])) : null;

function inRange(startTime, endTime, nowMinutes) {
  const s = toM(startTime);
  const e = toM(endTime);
  if (s === null && e === null) return false;
  if (s !== null && e !== null) {
    if (s <= e) return nowMinutes >= s && nowMinutes <= e;
    return nowMinutes >= s || nowMinutes <= e;
  }
  return s !== null ? nowMinutes >= s : nowMinutes <= e;
}

function testCase(start, end, samples) {
  console.log(`\nRange: ${start || '<null>'} - ${end || '<null>'}`);
  for (const [timeStr, expected] of samples) {
    const parts = timeStr.split(':');
    const nm = Number(parts[0]) * 60 + Number(parts[1]);
    const got = inRange(start, end, nm);
    const pass = got === expected ? 'ok' : 'FAIL';
    console.log(`${pass}  now=${timeStr} => inRange=${got} (expected ${expected})`);
  }
}

// Normal daytime range
testCase('09:00', '17:00', [
  ['08:59', false],
  ['09:00', true],
  ['12:00', true],
  ['17:00', true],
  ['17:01', false],
]);

// Overnight range
testCase('22:00', '06:00', [
  ['21:59', false],
  ['22:00', true],
  ['23:30', true],
  ['00:30', true],
  ['05:59', true],
  ['06:00', true],
  ['06:01', false],
]);

// Start only
testCase('15:00', null, [
  ['14:59', false],
  ['15:00', true],
  ['23:59', true],
]);

// End only
testCase(null, '10:00', [
  ['09:59', true],
  ['10:00', true],
  ['10:01', false],
]);

console.log('\nDone.');
