# Season Management

This API now includes automatic season detection to prevent unnecessary API calls to ESPN during the off-season.

## How It Works

### Automatic Season Control
- **API scraping only runs during active seasons** (configured date ranges)
- **Checks season status daily** at server startup and every 24 hours
- **Automatically starts/stops scraping** based on current date

### Current Configuration (2025-2026)

| Sport | Season Start | Season End | Status |
|-------|-------------|------------|---------|
| MLB   | March 20    | November 15 | ✓ Active |

### For Current Season (Today: October 9, 2025)

```
✓ Currently: API is ACTIVE (making calls every 30 seconds)
✓ API will STOP on: November 16, 2025
✓ API will RESUME on: March 20, 2026
✓ Off-season duration: ~124 days with NO API calls
```

## Verification

Run this command to verify season status at any time:

```bash
npx tsx src/utils/verifyCurrentSeason.ts
```

Or run comprehensive tests:

```bash
npx tsx src/utils/testSeasonDates.ts
```

## Updating Season Dates

⚠️ **IMPORTANT**: Update season dates annually in `src/constants/sports.ts`

```typescript
const SEASON_DATES = {
  [SPORTS.MLB]: { start: "03-20", end: "11-15" },
  // Update these dates each year!
};
```

### Typical Season Schedules

- **MLB**: March (Spring Training) through November (World Series)
- **NBA**: October through June (Finals)
- **NFL**: September through February (Super Bowl)
- **NHL**: September through June (Stanley Cup)
- **NCAAM**: November through April (March Madness)
- **NCAAF**: August through January (CFP Championship)

## Technical Details

### Files Modified

1. **`src/constants/sports.ts`**
   - Added `SEASON_DATES` configuration
   - Added `isInSeason()` function
   - Handles both same-year and year-spanning seasons

2. **`src/routes/events.ts`**
   - Added season-aware scraping control
   - Implemented `startSportScraping()` and `stopSportScraping()`
   - Added `checkAndUpdateSeasons()` for daily checks

### Logging

The system logs all season-related events:

```
[Schedule] Initializing sports schedule manager...
[Season Check] Checking season status for all sports...
[Season Check] MLB is in season and active
[Schedule] Started scraping for MLB (in season)
[Schedule] Season checks will run daily
```

When season ends:
```
[Season Check] MLB season has ended
[Schedule] Stopped scraping for MLB
```

When season resumes:
```
[Season Check] MLB season has started
[Schedule] Started scraping for MLB (in season)
```

## Benefits

1. **Reduced API Load**: No unnecessary calls during off-season
2. **Lower Costs**: Saves bandwidth and server resources
3. **Respectful Scraping**: Only scrapes when data is actually available
4. **Automatic Operation**: No manual intervention needed for season transitions

## Enabling Additional Sports

To enable other sports, uncomment them in `src/constants/sports.ts`:

```typescript
const SPORTS = {
  MLB: "MLB",
  NBA: "NBA",     // Uncomment to enable
  NFL: "NFL",     // Uncomment to enable
  // etc...
};

const SEASON_DATES = {
  [SPORTS.MLB]: { start: "03-20", end: "11-15" },
  [SPORTS.NBA]: { start: "10-15", end: "06-30" },  // Uncomment & configure
  [SPORTS.NFL]: { start: "09-01", end: "02-15" },  // Uncomment & configure
  // etc...
};
```

**Note**: Year-spanning seasons (NFL, NBA, NHL) are automatically handled correctly.

