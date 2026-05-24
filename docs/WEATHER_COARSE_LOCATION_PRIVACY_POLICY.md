# Weather Coarse Location Privacy Policy

M76 adds predefined coarse weather locations only.

## Allowed Location Precision

Allowed:

- province/city-center approximation
- static fixture coordinates for forecast lookup
- Thai label and region display

Blocked:

- GPS
- browser geolocation
- farm map pin
- exact field coordinate
- precise home coordinate
- storing personal location in Supabase

## Coarse Fixtures

M76 fixtures include:

- กรุงเทพฯ
- นครราชสีมา
- ขอนแก่น
- เชียงใหม่
- นครสวรรค์
- สุพรรณบุรี
- อุบลราชธานี
- สุราษฎร์ธานี
- สงขลา

Each fixture has `precision = province_or_city_center` and a Thai privacy note explaining that it is not a farm or home location.

## Future Preference Storage

Future weather preferences should store only coarse location ids unless a later reviewed milestone adds explicit consent, deletion, RLS, and privacy review for more specific location data.
## M77 Local Preference Boundary

The selected weather location is stored only as coarse location id and label in localStorage. The app does not store approximate lat/lon in the preference record and does not sync weather preference to Supabase.

Weather preferences must remain local-only until a later explicit consent and RLS-reviewed sync milestone.
