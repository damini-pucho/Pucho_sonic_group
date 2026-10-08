# Import sheet (step 6 gate)
| flow | trigger | actions | webhook URL (paste) | test run ✔ |
|---|---|---|---|---|
| BILL_READ | webhook.catch_webhook | extract | | |
| SALES_INVOICE | webhook.catch_webhook | raise | | |

After import: confirm the model id in each askLlm node; select connections; in the constants node set `app_url` (this app's public origin) and `inbound_token` (the same value as the app's `INBOUND_TOKEN`); run one action from the test panel.

## Where the URLs go (step 7)
Never into the bundle. One environment variable per flow, on the server (`app/.env` locally, the portal's environment fields in production):

| flow | variable |
|---|---|
| BILL_READ | `WEBHOOK_BILL_READ` |
| SALES_INVOICE | `WEBHOOK_SALES_INVOICE` |
| codes by email | `WEBHOOK_AUTH_OTP` |
| flows → this app | `INBOUND_TOKEN` (shared secret; unset = closed) |
