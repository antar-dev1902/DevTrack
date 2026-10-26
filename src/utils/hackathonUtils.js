// Hackathon date parsing, countdown, and dynamic status utilities

/**
 * Safely parses a date or deadline string without UTC offset shifting issues.
 * For date-only strings (YYYY-MM-DD), treats as end of day local time (23:59:59.999).
 */
export function parseDeadline(deadline) {
  if (!deadline) return null;
  if (typeof deadline === 'string') {
    const trimmed = deadline.trim();
    const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const day = parseInt(match[3], 10);
      return new Date(year, month, day, 23, 59, 59, 999);
    }
    const parsed = new Date(trimmed);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  if (deadline instanceof Date) {
    return isNaN(deadline.getTime()) ? null : deadline;
  }
  return null;
}

/**
 * Calculates calendar days remaining until deadline relative to a reference date.
 * Returns:
 *   > 0: days remaining in future
 *   0: closes today
 *   < 0: closed/expired
 *   null: unverified or missing deadline
 */
export function daysRemaining(deadline, referenceDate = new Date()) {
  const target = parseDeadline(deadline);
  if (!target) return null;

  const now = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
  if (isNaN(now.getTime())) return null;

  // Calendar midnight comparison
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  return Math.round((targetMidnight - nowMidnight) / 86400000);
}

/**
 * Dynamically determines opportunity status: 'upcoming', 'expired', or 'unverified'.
 * Automatically updates as time passes without manual code edits.
 */
export function getHackathonStatus(hackathon, referenceDate = new Date()) {
  if (!hackathon) return 'unverified';
  if (hackathon.status === 'unverified') return 'unverified';
  if (!hackathon.deadline) return 'unverified';

  const days = daysRemaining(hackathon.deadline, referenceDate);
  if (days === null) return 'unverified';
  return days >= 0 ? 'upcoming' : 'expired';
}
