# How to Set Up Domain Verification for Resend

## Steps to Send Emails to Any Recipient

### 1. Choose a Domain
You need to own a domain (e.g., `yourdomain.com` or use a subdomain like `mail.yourdomain.com`)

### 2. Add Domain to Resend
1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)

### 3. Add DNS Records
Resend will provide you with DNS records to add to your domain registrar:

**SPF Record (TXT)**
- Name: `@` (or your domain)
- Value: `v=spf1 include:_spf.resend.com ~all`

**DKIM Record (TXT)**
- Name: `resend._domainkey` (provided by Resend)
- Value: Long cryptographic key (provided by Resend)

**DMARC Record (TXT)** (optional but recommended)
- Name: `_dmarc`
- Value: `v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com`

### 4. Verify Domain
- Click "Verify DNS Records" in Resend dashboard
- Wait up to 72 hours for verification
- Once verified, you can send to ANY email address

### 5. Update Email Code
Change the `from` address in your code to use your verified domain:

```javascript
from: 'Elite Dental Care <noreply@yourdomain.com>'
```

## Alternative: Use Subdomain (Recommended)
Instead of your main domain, use a subdomain for better email reputation:
- `mail.yourdomain.com`
- `noreply.yourdomain.com`
- `app.yourdomain.com`

This protects your main domain's reputation.

## Free Tier Benefits After Domain Verification
- Send to ANY email address (no restrictions)
- 3,000 emails/month free
- Professional email delivery
- Better inbox placement than unverified domains