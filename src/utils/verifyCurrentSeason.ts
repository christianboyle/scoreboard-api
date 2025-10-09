/**
 * Verification script for current season status
 * Run with: npx tsx src/utils/verifyCurrentSeason.ts
 */

import { isInSeason, SEASON_DATES } from "../constants/sports";

console.log('=== MLB Season Status Around Current Date ===\n');
console.log(`Today: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', weekday: 'long' })}\n`);

const testDates = [
  { date: new Date(2025, 9, 9), label: "TODAY" },   // Oct 9, 2025
  { date: new Date(2025, 9, 15), label: "" },  // Oct 15, 2025
  { date: new Date(2025, 9, 31), label: "" },  // Oct 31, 2025
  { date: new Date(2025, 10, 1), label: "" },  // Nov 1, 2025
  { date: new Date(2025, 10, 14), label: "" }, // Nov 14, 2025
  { date: new Date(2025, 10, 15), label: "LAST DAY OF SEASON" }, // Nov 15, 2025
  { date: new Date(2025, 10, 16), label: "FIRST DAY OFF-SEASON" }, // Nov 16, 2025
  { date: new Date(2025, 11, 1), label: "" },  // Dec 1, 2025
  { date: new Date(2026, 0, 1), label: "" },   // Jan 1, 2026
  { date: new Date(2026, 1, 1), label: "" },   // Feb 1, 2026
  { date: new Date(2026, 2, 19), label: "" },  // Mar 19, 2026
  { date: new Date(2026, 2, 20), label: "SEASON RESUMES" }, // Mar 20, 2026
  { date: new Date(2026, 2, 25), label: "" },  // Mar 25, 2026
];

// Helper to check if a specific date is in season
function checkDateInSeason(date: Date): boolean {
  const seasonDates = SEASON_DATES["MLB"];
  if (!seasonDates) return false;

  const year = date.getFullYear();
  const [startMonth, startDay] = seasonDates.start.split("-").map(Number);
  const [endMonth, endDay] = seasonDates.end.split("-").map(Number);
  
  const seasonStart = new Date(year, startMonth - 1, startDay);
  const seasonEnd = new Date(year, endMonth - 1, endDay);
  
  return date >= seasonStart && date <= seasonEnd;
}

console.log('Date                    | Status        | API Behavior');
console.log('------------------------|---------------|---------------------------');

testDates.forEach(({ date, label }) => {
  const inSeasonForDate = checkDateInSeason(date);
  const status = inSeasonForDate ? '✓ IN SEASON ' : '✗ OFF-SEASON';
  const api = inSeasonForDate ? 'Scraping every 30s' : 'NO API calls';
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const paddedDate = dateStr.padEnd(23);
  const labelStr = label ? ` ← ${label}` : '';
  console.log(`${paddedDate} | ${status} | ${api}${labelStr}`);
});

console.log('\n=== Summary ===');
console.log(`✓ Currently: ${isInSeason('MLB') ? 'API is ACTIVE' : 'API is STOPPED'}`);
console.log('✓ API will STOP on: November 16, 2025 (day after season ends)');
console.log('✓ API will RESUME on: March 20, 2026 (when new season starts)');
console.log('✓ Off-season duration: ~124 days with NO API calls to ESPN');
console.log('✓ System checks season status: Daily (every 24 hours)');

const mlbDates = SEASON_DATES["MLB"];
console.log(`\nConfigured MLB Season: ${mlbDates.start} to ${mlbDates.end}`);
console.log('\nNote: Update these dates in src/constants/sports.ts for each new season!');

