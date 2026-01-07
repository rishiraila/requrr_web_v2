# TODO for Implementing WhatsApp API Routes

- [x] Update `src/app/api/whatsapp/credits/route.js`: Replace GET handler with admin-only version for all users' credits
- [x] Update `src/app/api/whatsapp/pricing/route.js`: Modify POST handler to include JWT authentication and set active=1
- [x] Create `src/app/api/whatsapp/pricing/[id]/route.js`: Add PUT handler for updating pricing by ID with admin auth
