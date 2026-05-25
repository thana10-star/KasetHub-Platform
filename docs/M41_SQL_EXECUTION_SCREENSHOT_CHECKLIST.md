# M41 SQL Execution Screenshot Checklist

Capture screenshots for the first real Supabase staging setup. Do not include secrets, full keys, database passwords, connection strings, or service-role values.

## 1. Project Settings

Capture:

- project name showing `kasethub-staging` or another clearly staging-only name
- selected region
- project reference if visible without secrets

Check:

- the project is not production
- there is no real user data
- the region is Singapore/closest practical region if available

## 2. API Page

Capture:

- Project URL location
- anon/public key label

Avoid:

- full anon key value if possible
- service-role key
- JWT contents
- connection strings

Check:

- only Project URL and anon/public key are copied to local `.env.local`
- service-role key is not copied anywhere

## 3. SQL Editor

Capture:

- schema SQL query tab before/after success
- RLS SQL query tab before/after success
- any error messages if a run fails

Check:

- schema SQL ran before RLS SQL
- file paths used were:
  - `supabase/migrations/0001_kasethub_core_schema.sql`
  - `supabase/policies/0001_kasethub_rls_policies.sql`
- no production project was selected

## 4. Table List

Capture:

- Table Editor list showing expected tables
- representative table detail page

Check:

- core tables exist
- no unexpected production table/data appears
- indexes, constraints, and triggers can be inspected

## 5. RLS Page

Capture:

- RLS enabled status on sensitive/user-owned tables
- policy list for representative public and private tables

Check:

- RLS is enabled where required
- no broad anon/public insert/update/delete policy exists
- owner policies use authenticated ownership such as `auth.uid()`

## Stop Conditions

Stop and record notes if:

- any screenshot exposes a key or secret
- SQL Editor returns an error
- the project is not clearly staging
- public write policy appears broader than intended
- auth/cloud sync/upload settings were enabled accidentally

## File Naming Suggestion

Use names that do not include secrets:

```text
m41-project-settings-staging.png
m41-api-page-masked.png
m41-sql-schema-success.png
m41-sql-rls-success.png
m41-table-list.png
m41-rls-policies.png
```
