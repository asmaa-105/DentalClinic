# Complete Guide: Set Up Resend Domain Verification

## Step-by-Step Process to Send Emails to Any Recipient

### Step 1: Choose Your Domain Strategy

**Option A: Use Your Main Domain** (if you own one)
- Example: `yourdomain.com`
- Emails will come from: `noreply@yourdomain.com`

**Option B: Use a Subdomain** (Recommended)
- Example: `mail.yourdomain.com`
- Emails will come from: `noreply@mail.yourdomain.com`
- Better for email reputation

**Option C: Get a New Domain** (if you don't have one)
- Purchase from: Namecheap, GoDaddy, or Google Domains
- Cost: $10-15/year
- Example: `anasdentalclinic.com `

### Step 2: Add Domain to Resend Dashboard

1. **Log into Resend**
   - Go to https://resend.com
   - Sign in to your account

2. **Navigate to Domains**
   - Click "Domains" in the left sidebar
   - Click "Add Domain" button

3. **Enter Your Domain**
   - Type your domain: `yourdomain.com` (or subdomain)
   - Click "Add Domain"

### Step 3: Configure DNS Records

Resend will show you 3 DNS records to add. Here's what you'll see:

**🔹 SPF Record (TXT)**
```
Name: @ (or yourdomain.com)
Value: v=spf1 include:_spf.resend.com ~all
```

**🔹 DKIM Record (TXT)**
```
Name: resend._domainkey.yourdomain.com
Value: [Long cryptographic key provided by Resend]
```

**🔹 DMARC Record (TXT)** (Optional but recommended)
```
Name: _dmarc.yourdomain.com
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com
```

### Step 4: Add DNS Records to Your Domain Provider

**For Popular Providers:**

**Namecheap:**
1. Log into Namecheap
2. Go to Domain List → Manage → Advanced DNS
3. Add each record as "TXT Record"

**GoDaddy:**
1. Log into GoDaddy
2. Go to My Products → DNS → Manage
3. Add each record as "TXT"

**Cloudflare:**
1. Log into Cloudflare
2. Select your domain → DNS → Records
3. Add each record as "TXT"

**Google Domains:**
1. Log into Google Domains
2. Go to DNS → Custom Records
3. Add each record as "TXT"

### Step 5: Verify Your Domain

1. **Return to Resend Dashboard**
   - Go back to your domain in Resend
   - Click "Verify DNS Records"

2. **Wait for Verification**
   - Can take 5 minutes to 72 hours
   - Most domains verify within 1 hour
   - You'll get an email when it's verified

3. **Check Status**
   - Domain status will show "Verified" when ready
   - Green checkmark appears next to your domain

### Step 6: Update Your Email Code

Once verified, update the email sender address:

```javascript
// In server/email-resend.ts, update the 'from' addresses:
from: 'Anas Dental Clinic <noreply@yourdomain.com>'
```

### Step 7: Test Email Delivery

After verification, test sending to any email address:
- Book an appointment with any email
- Email will be delivered to the actual recipient
- Check spam folder if not in inbox initially

## Troubleshooting

**❌ Verification Failed**
- Double-check DNS records are exactly as provided
- Wait 24 hours and try again
- Contact your domain provider if issues persist

**❌ Emails Going to Spam**
- Add DMARC record
- Wait a few days for reputation to build
- Ask recipients to mark as "Not Spam"

**❌ Can't Find DNS Settings**
- Contact your domain provider's support
- Look for "DNS Management" or "Advanced DNS"
- Search "[your provider] add TXT record"

## Benefits After Setup

✅ Send to ANY email address (no restrictions)
✅ 3,000 emails/month free (enough for most dental clinics)
✅ Professional appearance from your domain
✅ Better deliverability than free services
✅ Email tracking and analytics
✅ Automatic bounce handling

## Next Steps

1. **Complete domain verification** (Steps 1-5 above)
2. **Update email code** (Step 6)
3. **Test with real email addresses** (Step 7)
4. **Monitor email delivery** in Resend dashboard

**Need help?** Let me know which domain provider you're using and I can provide specific instructions for adding DNS records.