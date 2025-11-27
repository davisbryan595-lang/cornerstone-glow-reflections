# Membership Access Code System

## Overview
This document describes the membership access code system that automatically generates and assigns unique access codes to members, sends confirmation emails, and provides admin visibility into these assignments.

## Features Implemented

### 1. **Automatic Access Code Generation for Members**
- When a user completes their membership purchase, a unique access code is automatically generated
- Each member receives exactly one active access code assigned to their membership
- Access codes are stored in the `access_codes` table with the following properties:
  - `code`: The unique access code string
  - `user_id`: The user who owns this membership
  - `membership_id`: The membership this code is assigned to
  - `plan_id`: The membership plan type
  - `is_used`: Marked as true for member-assigned codes
  - `expires_at`: 365-day expiration from creation
  - `created_at` / `used_at`: Timestamp tracking

### 2. **Confirmation Email with Access Code**
- New members receive a beautiful HTML confirmation email immediately after purchase
- Email includes:
  - Congratulations message and welcome
  - Plan name and monthly price
  - **The unique access code (prominently displayed)**
  - What they get as a member
  - Next steps instructions
  - Contact information for support
- Email is sent via the `/api/send-membership-confirmation` endpoint
- Email sending is non-blocking - membership creation succeeds even if email fails

### 3. **Admin Dashboard Enhancements**

#### Members Tab
- Access code column now visible in the members table
- Shows each member's assigned access code
- Quick copy-to-clipboard button for easy code distribution
- Filter and search members by email and status

#### New "Member Codes" Tab
- Dedicated view showing all active members and their assigned access codes
- Displays:
  - Member email
  - Membership plan tier
  - Assigned access code (in highlighted box)
  - Assignment date
  - Current status
  - Quick copy button
- Export functionality to download member access code assignments as CSV

#### Enhanced Exports
- Members CSV now includes the `assigned_access_code` column
- New export: "Member Access Code Assignments" CSV
- All exports include email, plan, access code, and assignment date

### 4. **Database Structure**
Access codes are managed in the `access_codes` table with these key columns:
- `id`: Primary key
- `code`: The actual access code string
- `user_id`: User who owns the membership
- `membership_id`: Associated membership record
- `plan_id`: The membership plan type
- `is_used`: Boolean flag (true for member codes)
- `expires_at`: Expiration timestamp (365 days from creation)
- `created_at` / `updated_at`: Automatic timestamps
- `used_at`: When the code was assigned to a member

### 5. **API Endpoints**

#### POST `/api/send-membership-confirmation`
Sends the membership confirmation email with access code.

**Request body:**
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "planName": "Maintenance - Premium",
  "accessCode": "CM-ABC123XYZ",
  "monthlyPrice": 199.99,
  "startDate": "2024-01-15T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Membership confirmation email queued for delivery",
  "recipient": "john@example.com"
}
```

## Flow Diagram

```
User Selects Plan
     ↓
User Completes Checkout
     ↓
Payment Processing
     ↓
Membership Created in DB
     ↓
Generate Unique Access Code
     ↓
Store Access Code in DB
     ↓
Send Confirmation Email (with code)
     ↓
User Redirected to Dashboard
     ↓
Member Receives Email with Code
```

## Files Modified/Created

### New Files
- `src/lib/membershipEmail.ts` - Email sending service for membership confirmations
- `src/lib/membershipUtils.ts` - Utility functions for membership creation with access codes
- `api/membership-confirmation.ts` - API endpoint for sending confirmation emails

### Modified Files
- `src/pages/Checkout.tsx` - Updated to generate and send access codes to new members
- `src/pages/Admin.tsx` - Enhanced Members tab and new Member Codes tab for admin visibility

## How It Works

### For New Members
1. User selects a membership plan and completes payment
2. System creates membership record with status "active"
3. Unique access code is generated and assigned
4. Confirmation email is sent to user's email address
5. User receives email with their access code
6. User can use access code to log in and access member benefits

### For Admins
1. Admin can view all members and their assigned access codes in the Members tab
2. Access codes are displayed with quick copy buttons for easy distribution
3. New "Member Codes" tab provides dedicated view of all access code assignments
4. Admins can export member-to-access-code mappings as CSV
5. Assignments are sortable and searchable by email

## Access Code Format
- Format: `CM-` followed by 16 random alphanumeric characters
- Example: `CM-ABC123XYZ789DEF`
- Unique per member
- 365-day validity period
- Cannot be reused once assigned

## Integration with Existing Code

### Database Functions (from `src/lib/database.ts`)
The system uses these pre-existing functions:
```typescript
db.accessCodes.create(accessCode)        // Create new access code
db.accessCodes.get(code)                 // Get specific code
db.accessCodes.getByMembership(id)       // Get code by membership ID
db.accessCodes.listByUser(userId)        // Get all codes for user
db.accessCodes.listAll()                 // Get all codes
db.accessCodes.markAsUsed(id)            // Mark code as used
```

## Email Service Integration

The system is ready to integrate with any email service provider:
- **SendGrid**: Configure VITE_MEMBERSHIP_WEBHOOK_URL to SendGrid webhook
- **Mailgun**: Configure to Mailgun API endpoint
- **AWS SES**: Configure to SES endpoint
- **Custom**: Implement custom email handler in `/api/send-membership-confirmation`

For now, emails are logged to console in development. Configure your preferred email service by:
1. Adding `VITE_MEMBERSHIP_WEBHOOK_URL` environment variable
2. Implementing email sending in `/api/send-membership-confirmation`

## Testing Checklist

- [ ] User completes membership purchase
- [ ] Access code is generated in database
- [ ] Confirmation email is sent
- [ ] Member receives email with access code
- [ ] Admin can see access code in Members tab
- [ ] Admin can see access code in Member Codes tab
- [ ] Copy-to-clipboard button works
- [ ] CSV exports include access codes
- [ ] Member can use access code to access benefits

## Future Enhancements

1. **Access Code Regeneration**: Allow members to regenerate codes if compromised
2. **Access Code Sharing**: Allow members to share codes with family members (for multi-user support)
3. **Bulk Access Code Generation**: Pre-generate codes for batch member onboarding
4. **Access Code Analytics**: Track which codes are used vs. unused
5. **Email Resend**: Admin ability to resend confirmation email with code
6. **Code Expiration Notifications**: Send reminders before code expires (if used for temporary access)
