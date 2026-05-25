# Weather Local Preference Persistence

M77 stores weather preferences locally only.

Stored fields:

- selected coarse location id
- selected location label
- updated timestamp
- source mode

Storage:

- `localStorage`
- key: `kasethub.weatherLocalPreference.v1`

Not stored:

- GPS data
- farm coordinates
- map pins
- precise personal location
- Supabase session data
- cloud sync state

No Supabase write, backend write, or cloud sync is allowed for weather preferences until a later consent and RLS-reviewed milestone.

