# ChartDepth Frontend

## المتطلبات
- Node.js 18+
- حساب Firebase (لإشعارات FCM إذا رغبت)
- ضبط إعدادات Stripe في backend

## الإعداد والتشغيل

1. **تثبيت الحزم**
   ```bash
   cd frontend
   npm install
   ```

2. **تعديل بيانات Firebase**
   - ضع بيانات مشروعك في `src/firebase.js` و `public/firebase-messaging-sw.js`

3. **تشغيل المشروع**
   ```bash
   npm run dev
   ```

> الآن التطبيق يعمل على http://localhost:5173  
> يجب أن يكون backend يعمل على http://localhost:5000