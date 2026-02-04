# Debugging Client Reminder Emails

## Issue
Emails to clients for renewal reminders are not being sent.

## Debugging Steps
- [x] Add logging to run-cron/route.js to log attempts to send client emails
- [x] Add logging to mailer.js to log MSG91 payload and response
- [ ] Run the cron job manually via GET /api/run-cron?secret=<CRON_SECRET>
- [ ] Check console logs for:
  - Whether "Attempting to send client email..." messages appear
  - MSG91 payload structure
  - MSG91 response or errors
- [ ] Identify the root cause based on logs:
  - No records matching due date conditions
  - client_email_notifications disabled
  - Missing client email
  - Already notified today (last_notified_date)
  - MSG91 API errors (wrong auth, template not found, domain issues)
  - Template variables mismatch
- [ ] Fix the identified issue
- [ ] Test again by running cron manually
