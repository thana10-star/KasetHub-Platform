# Support Contact Decision M105

## Purpose

This document records practical support-channel options for V1. It does not implement in-app chat, ticketing, LINE integration, or support automation.

M106 public support copy: `docs/release/v1-package/SUPPORT_CONTACT_PUBLIC_COPY_M106.md`.

## Options

## 1. Email Support

Pros:

- simplest to launch
- works for store submission requirements
- easy for the owner to control
- can be listed in privacy policy, store listing, and support docs

Cons:

- can become hard to organize if volume grows
- users may forget to include phone, device, or screenshot context

Best for V1 if the owner wants the lowest-maintenance path.

## 2. Google Form

Pros:

- structured questions make feedback easier to triage
- can ask for route, device, issue type, screenshot link, and optional contact
- no app code needed

Cons:

- users may trust email more than a form
- privacy wording must explain what information is collected
- form link must remain public and stable

Best for V1 if the owner wants organized feedback from testers.

## 3. Facebook Page / YouTube Community

Pros:

- familiar to many users
- useful for announcement and learning content
- can collect informal feedback quickly

Cons:

- less private for user issues
- harder to track individual support cases
- store support requirements may still need email or URL

Good as a secondary community channel, not the only support path.

## 4. LINE Official Later

Pros:

- familiar channel for Thai users
- useful for future customer support and announcements

Cons:

- adds account/channel maintenance
- can create expectations for fast replies
- should be scoped separately if automated replies or notifications are added

Recommended later, not required for V1.

## 5. In-app Support Later

Pros:

- easiest for users once implemented
- can include app/version/device context

Cons:

- requires product and privacy work
- may involve data collection, uploads, or support backend
- can expand scope beyond V1 release-readiness

Do not add in-app chat for V1.

## V1 Recommendation

Start with one simple public support path:

- support email, or
- Google Form

Keep it easy, low-maintenance, and clearly listed in the privacy policy/store listing. Do not add in-app chat, support backend, or LINE integration for V1.

## Owner Placeholders

- Support email: TBD
- Support form URL: TBD
- YouTube channel: owner can add later
- Facebook page: owner can add later
- LINE Official: later candidate

## Decision Status

- V1 support path: pending owner selection
- Recommended default: support email first
- Alternate V1 path: Google Form if structured tester feedback is preferred
- In-app support: deferred
