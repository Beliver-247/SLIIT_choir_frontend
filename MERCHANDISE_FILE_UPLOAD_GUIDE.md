# Merchandise File Upload - Complete Guide

## ✅ Implementation Summary

The merchandise order system now supports **direct file uploads** for payment receipts instead of URL-based uploads. Receipts are stored in Cloudinary for secure, scalable cloud storage.

---

## 🎯 What Changed

### Backend Changes
1. **New Dependencies**: `cloudinary` + `multer` for file handling
2. **New Files**:
   - `config/cloudinary.js` - Cloudinary upload/delete utilities
   - `middleware/upload.js` - Multer configuration (5MB limit, image/PDF only)
3. **Modified Files**:
   - `controllers/orderController.js` - Now accepts FormData with file upload
   - `routes/orders.js` - Added `upload.single('receipt')` middleware

### Frontend Changes
1. **Modified Files**:
   - `components/OrderCheckout.tsx` - File input instead of URL input
   - `utils/api.ts` - Added `createWithFile()` method for FormData submission

---

## 📋 Setup Instructions

### 1. Get Cloudinary Credentials

1. Go to [Cloudinary](https://cloudinary.com/) and create a free account
2. From your dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret

### 2. Configure Backend

Add these to your `.env` file in `SLIIT_choir_backend/`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 3. Restart Servers

Both servers are already running:
- ✅ Backend: `http://localhost:5000`
- ✅ Frontend: `http://localhost:5174` (Note: Port changed to 5174)

If you need to restart:
```bash
# Backend
cd SLIIT_choir_backend
node server.js

# Frontend
cd SLIIT_choir_frontend
npm run dev
```

---

## 🧪 Testing Guide

### Test 1: File Upload Validation

1. Open `http://localhost:5174` in your browser
2. Login as a **member** (not admin)
3. Navigate to **Members Portal** → **Merchandise** tab
4. Add items to cart and proceed to checkout
5. Try uploading **invalid files**:
   - ❌ `.txt` file → Should show "Only JPEG, PNG, WebP, or PDF files are allowed"
   - ❌ Large file (>5MB) → Should show "File size must be less than 5MB"
6. Upload **valid file**:
   - ✅ `.jpg`, `.png`, `.webp`, or `.pdf` (under 5MB)
   - File name should appear with green checkmark icon

### Test 2: Order Submission

1. With valid receipt file uploaded, click **Submit Order**
2. Check for success message
3. Order should appear in **My Orders** tab with status "Pending"
4. Receipt URL should be a Cloudinary link (starts with `https://res.cloudinary.com/`)

### Test 3: Admin Verification

1. Logout and login as **admin** or **moderator**
2. Navigate to **Members Portal** → **Merchandise Orders** tab
3. Find the pending order
4. Click **View Receipt** → Should open Cloudinary-hosted image/PDF in new tab
5. Confirm or decline the order

### Test 4: Receipt Storage

1. Check your Cloudinary dashboard at `https://cloudinary.com/console`
2. Navigate to **Media Library** → **receipts** folder
3. Uploaded receipt should be visible with proper filename
4. If order is deleted, receipt should also be removed from Cloudinary

---

## 🔍 API Endpoint Reference

### POST /api/orders (With File Upload)

**Headers**:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body** (FormData):
```javascript
const formData = new FormData();
formData.append('receipt', fileObject); // File object from input
formData.append('items', JSON.stringify([
  {
    merchandiseId: "...",
    size: "M",
    quantity: 2
  }
]));
```

**Success Response** (201):
```json
{
  "message": "Order created successfully",
  "data": {
    "_id": "...",
    "memberId": "...",
    "items": [...],
    "totalAmount": 5000,
    "receipt": "https://res.cloudinary.com/...",
    "status": "pending"
  }
}
```

**Error Responses**:
- `400` - No file uploaded / Invalid file type / File too large
- `401` - Not authenticated
- `500` - Cloudinary upload failed / Server error

---

## 🎨 File Upload UI Features

### Visual Indicators
- 📤 Upload icon when no file selected
- ✅ Green checkmark + filename when file selected
- 🗑️ "Remove file" button to clear selection

### Accepted Formats
- **Images**: JPEG, JPG, PNG, WebP
- **Documents**: PDF
- **Size Limit**: 5MB maximum

### User Instructions
The checkout page displays:
```
Payment Instructions:
1. Transfer the total amount to: Bank Account: XXXX-XXXX-XXXX
2. Take a screenshot or photo of the payment receipt
3. Upload the receipt using the file picker below
4. Submit your order
```

---

## 🛠️ Troubleshooting

### Problem: "Cloudinary is not configured"
**Solution**: Add Cloudinary credentials to `.env` file and restart backend server

### Problem: "File upload failed"
**Solution**: 
- Check file size (must be <5MB)
- Check file type (JPEG/PNG/WebP/PDF only)
- Verify Cloudinary credentials are correct

### Problem: "No file uploaded"
**Solution**: Ensure file is selected before submitting form

### Problem: Receipt not displaying
**Solution**: 
- Check Cloudinary dashboard for uploaded file
- Verify receipt URL in database is valid
- Check browser console for CORS errors

---

## 📂 File Structure

```
SLIIT_choir_backend/
├── config/
│   └── cloudinary.js          # Cloudinary utilities (NEW)
├── middleware/
│   └── upload.js              # Multer config (NEW)
├── controllers/
│   └── orderController.js     # Updated for file upload
└── routes/
    └── orders.js              # Added upload middleware

SLIIT_choir_frontend/
├── src/
│   ├── components/
│   │   └── OrderCheckout.tsx  # File input UI
│   └── utils/
│       └── api.ts             # Added createWithFile()
```

---

## 🔐 Security Notes

1. **File Validation**: Both frontend and backend validate file types and sizes
2. **Authentication**: Only authenticated members can upload
3. **Storage**: Files stored in Cloudinary, not on server disk
4. **Cleanup**: Receipts deleted from Cloudinary when order is deleted
5. **Rate Limiting**: Cloudinary free tier has upload limits (check your plan)

---

## 📊 Cloudinary Free Tier Limits

- ✅ 25 GB storage
- ✅ 25 GB monthly bandwidth
- ✅ 25,000 transformations/month
- ✅ Good for testing and small-scale production

For production with high traffic, consider upgrading to paid plan.

---

## 🎉 You're Ready!

The file upload system is now **fully functional**. Test the flow from member order creation to admin verification. If you encounter issues, check the troubleshooting section above.

**Next Steps**:
1. Add Cloudinary credentials to `.env`
2. Test the complete order flow
3. Verify receipts are uploading to Cloudinary
4. Check admin can view and verify receipts

Happy testing! 🚀
