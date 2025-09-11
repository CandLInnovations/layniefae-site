# 🌟 Supabase Database Setup for Laynie Fae

## 📋 Quick Setup Steps

### 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub or email
3. Create a new project
4. Choose a region (closest to your customers)

### 2. Set Up Database
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the entire contents of `database/schema.sql`
3. Click **Run** to create all tables

### 3. Get Your Keys
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** 
   - **Public anon key**
   - **Service role key** (this bypasses Row Level Security for admin operations)

### 4. Add Environment Variables
Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Existing JWT Secret (keep this)
JWT_SECRET=your-secret-key-change-in-production
```

⚠️ **Important**: The Service Role Key is very powerful and bypasses all security rules. Keep it secret and only use it on the server-side!

### 5. Test the Connection
1. Restart your dev server: `npm run dev`
2. Go to `/admin/dashboard`
3. Click on the **Categories** tab
4. Try adding a custom category!

## 🗄️ Database Structure

### Categories Table
- **Default categories**: Pre-populated mystical business categories
- **Custom categories**: Add your own unique categories
- **Slug system**: URL-friendly category identifiers

### Future-Ready Tables
- **Customers**: Customer accounts, preferences, birth dates
- **Orders**: Complete order tracking with ritual delivery dates
- **Products**: Enhanced product management with Supabase
- **Gift Cards**: Database-backed gift card system
- **Reviews**: Customer product reviews
- **Wishlist**: Customer favorites and wish lists
- **Newsletter**: Email subscription management

## 🔐 Security Features

### Row Level Security (RLS)
- **Public access**: Categories and active products
- **Admin access**: Full management capabilities
- **Customer access**: Only their own data

### Data Protection
- **Encrypted storage**: All data encrypted at rest
- **Secure connections**: SSL/TLS for all API calls
- **Access control**: Role-based permissions

## 🚀 What This Enables

### Immediate Benefits
✅ **Categories work everywhere** - Any device, any browser
✅ **No data loss** - Categories persist across sessions
✅ **Real-time updates** - Changes appear instantly
✅ **Admin collaboration** - Multiple admins can manage categories

### Future Features Ready
✅ **Customer accounts** - Registration, login, profiles
✅ **Order management** - Track purchases, fulfillment
✅ **Inventory tracking** - Real-time stock levels
✅ **Analytics dashboard** - Sales insights, customer data
✅ **Email automation** - Order confirmations, newsletters
✅ **Mobile app ready** - Same database for future mobile app

## 💡 Pro Tips

### Development
- Use the **Table Editor** in Supabase to view/edit data directly
- Check **Logs** tab for debugging API calls
- Use **API Docs** for reference on table operations

### Production
- Enable **Database Backups** in Supabase settings
- Set up **Webhook notifications** for important events
- Monitor **Usage** to track growth

## 🆘 Troubleshooting

### Common Issues
1. **"Failed to fetch categories"**
   - Check environment variables are set correctly
   - Verify Supabase project is running
   - Check browser console for specific errors

2. **"Unauthorized" errors**
   - Make sure RLS policies are set up correctly
   - Check if admin JWT token is valid

3. **Categories not showing in product form**
   - Restart dev server after adding environment variables
   - Check that categories API is responding

### Need Help?
- Check Supabase docs: [supabase.com/docs](https://supabase.com/docs)
- View database logs in Supabase dashboard
- Test API endpoints directly in browser

## 🌈 What's Next?

Once categories are working, we can easily add:
- **Customer registration/login**
- **Order processing and tracking**
- **Inventory management**
- **Email notifications**
- **Analytics and reporting**
- **Mobile app support**

The foundation is now set for a complete e-commerce platform! ✨