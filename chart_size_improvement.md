# تحسين حجم الرسوم البيانية

## نظرة عامة
بناءً على ملاحظات المستخدم، تم تحديد أن الرسوم البيانية في التطبيق كانت صغيرة جداً وصعبة القراءة. تم إجراء تعديلات لزيادة حجم الرسوم البيانية وتحسين قابلية القراءة.

## التغييرات التي تم إجراؤها

### 1. تعديلات CSS
تم زيادة الارتفاع الأدنى للرسم البياني في ملف `charts.css`:

**قبل التعديل:**
```css
.chart-container {
    flex-grow: 1;
    min-height: 500px;
    background-color: #131722;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #2a2e39;
}
```

**بعد التعديل:**
```css
.chart-container {
    flex-grow: 1;
    min-height: 650px; /* زيادة الارتفاع من 500 إلى 650 */
    background-color: #131722;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #2a2e39;
    width: 100%; /* ضمان استخدام العرض الكامل */
}
```

كما تم تعديل الارتفاع للأجهزة المحمولة:

**قبل التعديل:**
```css
@media (max-width: 768px) {
    .chart-container {
        min-height: 350px;
    }
}
```

**بعد التعديل:**
```css
@media (max-width: 768px) {
    .chart-container {
        min-height: 450px; /* زيادة الارتفاع للأجهزة المحمولة من 350 إلى 450 */
    }
}
```

### 2. تعديلات JavaScript
تم تعديل إنشاء الرسم البياني في ملف `Charts.js` لزيادة الارتفاع:

**قبل التعديل:**
```javascript
const chart = window.LightweightCharts.createChart(chartContainer, {
    width: chartContainer.clientWidth,
    height: 500,
    layout: {
        // ...
    },
});
```

**بعد التعديل:**
```javascript
const chart = window.LightweightCharts.createChart(chartContainer, {
    width: chartContainer.clientWidth,
    height: 650, // زيادة الارتفاع من 500 إلى 650
    layout: {
        // ...
    },
});
```

### 3. تعديل معالج تغيير حجم النافذة
تم تعديل معالج تغيير حجم النافذة لضمان الحفاظ على الحجم المناسب عند تغيير حجم النافذة:

**قبل التعديل:**
```javascript
handleResize() {
    if (!this.charts.main) return;
    
    const chartContainer = document.getElementById('chart-container');
    if (!chartContainer) return;
    
    const width = chartContainer.clientWidth;
    const height = Math.max(500, window.innerHeight * 0.6);
    
    this.charts.main.resize(width, height);
}
```

**بعد التعديل:**
```javascript
handleResize() {
    if (!this.charts.main) return;
    
    const chartContainer = document.getElementById('chart-container');
    if (!chartContainer) return;
    
    const width = chartContainer.clientWidth;
    const height = Math.max(650, window.innerHeight * 0.7); // زيادة الارتفاع الأدنى من 500 إلى 650 ونسبة النافذة من 0.6 إلى 0.7
    
    this.charts.main.resize(width, height);
}
```

## النتائج
- تم زيادة حجم الرسوم البيانية بنسبة 30% (من 500px إلى 650px)
- تحسنت قابلية القراءة بشكل كبير
- تم الحفاظ على التناسق في جميع أحجام الشاشات
- تم تحسين تجربة المستخدم على الأجهزة المحمولة

## اختبار التوافق
تم اختبار التغييرات على مجموعة متنوعة من الأجهزة والمتصفحات للتأكد من أن الرسوم البيانية تظهر بشكل صحيح وبحجم مناسب على جميع الأجهزة.

## الرابط المحدث
يمكن الوصول إلى النسخة المحدثة من التطبيق على الرابط التالي:
https://onnftpba.manus.space
