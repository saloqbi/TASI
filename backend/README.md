# ChartDepth Backend

## المتطلبات
- Node.js 18+
- MongoDB
- حساب Stripe (للاشتراك المدفوع)
- حساب Firebase (في حالة إشعارات FCM)

## الإعداد والتشغيل

1. **تعديل ملف البيئة**
   - عدل الملف `.env` وضع معلوماتك:
     - `MONGO_URI`: رابط قاعدة بيانات MongoDB
     - `JWT_SECRET`: أي قيمة عشوائية قوية
     - `STRIPE_SECRET`: مفتاح Stripe السري
     - `STRIPE_PRICE_ID`: من لوحة Stripe (منتج الاشتراك)
     - `FRONTEND_URL`: عادة `http://localhost:5173`
     - `STRIPE_WEBHOOK_SECRET`: تحصل عليه عند تفعيل Webhook في Stripe

2. **تثبيت الحزم**
   ```bash
   npm install
   ```

3. **تشغيل الخادم**
   ```bash
   npm run dev
   ```

> الآن الخادم يعمل على http://localhost:5000