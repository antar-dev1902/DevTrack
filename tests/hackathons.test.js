import test from 'node:test';
import assert from 'node:assert/strict';
import hackathonsData from '../src/data/hackathonsData.js';
import {
  parseDeadline,
  daysRemaining,
  getHackathonStatus,
} from '../src/utils/hackathonUtils.js';

test('1. Verify that expired opportunities are identified as expired and not upcoming', () => {
  const referenceDate = new Date('2026-10-26T15:00:00');

  // Find a past hackathon
  const pastEvent = hackathonsData.find((h) => h.id === 'h2'); // Global Web Jam (deadline: 2026-09-12)
  assert.ok(pastEvent, 'Past event exists in dataset');

  const status = getHackathonStatus(pastEvent, referenceDate);
  const days = daysRemaining(pastEvent.deadline, referenceDate);

  assert.equal(status, 'expired');
  assert.ok(days < 0, `Expected days to be negative for past deadline, got ${days}`);
});

test('2. Verify that future opportunities are categorized correctly as upcoming', () => {
  const referenceDate = new Date('2026-10-26T15:00:00');

  // NASA Space Apps Challenge (deadline: 2026-11-15)
  const nasaEvent = hackathonsData.find((h) => h.id === 'h1');
  assert.ok(nasaEvent, 'NASA Space Apps event exists');

  const status = getHackathonStatus(nasaEvent, referenceDate);
  const days = daysRemaining(nasaEvent.deadline, referenceDate);

  assert.equal(status, 'upcoming');
  assert.equal(days, 20); // 20 days between Oct 26 and Nov 15
});

test('3. Test events with missing or unverified deadlines', () => {
  const referenceDate = new Date('2026-10-26T15:00:00');

  const missingDeadlineEvent = {
    id: 'test-unverified-1',
    name: 'Unverified Hackathon',
    deadline: null,
  };

  const markedUnverifiedEvent = {
    id: 'test-unverified-2',
    name: 'TBD Hackathon',
    deadline: '2026-12-01',
    status: 'unverified',
  };

  const invalidDateEvent = {
    id: 'test-unverified-3',
    name: 'Invalid Date Hackathon',
    deadline: 'not-a-date',
  };

  assert.equal(getHackathonStatus(missingDeadlineEvent, referenceDate), 'unverified');
  assert.equal(daysRemaining(missingDeadlineEvent.deadline, referenceDate), null);

  assert.equal(getHackathonStatus(markedUnverifiedEvent, referenceDate), 'unverified');

  assert.equal(getHackathonStatus(invalidDateEvent, referenceDate), 'unverified');
  assert.equal(daysRemaining(invalidDateEvent.deadline, referenceDate), null);
});

test('4. Confirm that registration links point to the correct official pages', () => {
  for (const h of hackathonsData) {
    const url = h.registrationUrl || h.website;
    assert.ok(url, `Hackathon ${h.name} must have a registration URL or website`);
    assert.match(url, /^https?:\/\//, `Hackathon ${h.name} URL must be a valid http/https URL`);
  }

  const nasa = hackathonsData.find((h) => h.id === 'h1');
  assert.equal(nasa.registrationUrl, 'https://www.spaceappschallenge.org/');

  const campusHack = hackathonsData.find((h) => h.id === 'h7');
  assert.equal(campusHack.registrationUrl, 'https://mlh.io');
});

test('5. Test date logic around midnight and timezone boundaries without UTC shift', () => {
  // Midnight on October 26
  const refMorning = new Date(2026, 9, 26, 0, 0, 1); // 2026-10-26 00:00:01
  const refEvening = new Date(2026, 9, 26, 23, 59, 58); // 2026-10-26 23:59:58
  const nextDay = new Date(2026, 9, 27, 0, 0, 1); // 2026-10-27 00:00:01

  // Event that closes on October 26
  const todayEvent = { id: 'today', deadline: '2026-10-26' };

  // In the morning of the deadline day: closes today (0 days)
  assert.equal(daysRemaining(todayEvent.deadline, refMorning), 0);
  assert.equal(getHackathonStatus(todayEvent, refMorning), 'upcoming');

  // In the evening of the deadline day: closes today (0 days)
  assert.equal(daysRemaining(todayEvent.deadline, refEvening), 0);
  assert.equal(getHackathonStatus(todayEvent, refEvening), 'upcoming');

  // The moment the calendar day rolls over to the 27th: closed (-1 days)
  assert.equal(daysRemaining(todayEvent.deadline, nextDay), -1);
  assert.equal(getHackathonStatus(todayEvent, nextDay), 'expired');

  // Verify that date-only string YYYY-MM-DD parsing does not shift day backwards
  const parsed = parseDeadline('2026-11-05');
  assert.equal(parsed.getFullYear(), 2026);
  assert.equal(parsed.getMonth(), 10); // November is month index 10
  assert.equal(parsed.getDate(), 5);
});

test('6. Confirm that statuses update automatically as time passes', () => {
  const dynamicEvent = {
    id: 'dynamic-test',
    name: 'Dynamic Test Challenge',
    deadline: '2026-11-01',
  };

  // Before deadline
  const beforeTime = new Date('2026-10-31T20:00:00');
  assert.equal(getHackathonStatus(dynamicEvent, beforeTime), 'upcoming');
  assert.equal(daysRemaining(dynamicEvent.deadline, beforeTime), 1);

  // On deadline day
  const deadlineDay = new Date('2026-11-01T12:00:00');
  assert.equal(getHackathonStatus(dynamicEvent, deadlineDay), 'upcoming');
  assert.equal(daysRemaining(dynamicEvent.deadline, deadlineDay), 0);

  // After deadline passed
  const afterTime = new Date('2026-11-02T08:00:00');
  assert.equal(getHackathonStatus(dynamicEvent, afterTime), 'expired');
  assert.equal(daysRemaining(dynamicEvent.deadline, afterTime), -1);
});
