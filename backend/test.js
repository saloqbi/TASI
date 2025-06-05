// test.js - ملف اختبار الميزات والوظائف

// استيراد المكتبات اللازمة
const assert = require('assert');
const axios = require('axios');
const WebSocket = require('ws');

// عنوان الخادم المحلي
const API_URL = 'http://localhost:3000/api';
const WS_URL = 'ws://localhost:3000';

// بيانات الاختبار
const testUser = {
    name: 'مستخدم الاختبار',
    email: 'test@example.com',
    password: 'password123'
};

let authToken = '';

// اختبار المصادقة
async function testAuthentication() {
    console.log('=== اختبار المصادقة ===');
    
    try {
        // اختبار التسجيل
        console.log('اختبار التسجيل...');
        const registerResponse = await axios.post(`${API_URL}/auth/register`, testUser);
        assert(registerResponse.status === 201, 'يجب أن تكون استجابة التسجيل 201');
        assert(registerResponse.data.token, 'يجب أن تحتوي استجابة التسجيل على رمز');
        assert(registerResponse.data.user.email === testUser.email, 'يجب أن يكون البريد الإلكتروني للمستخدم صحيحاً');
        console.log('✅ اختبار التسجيل ناجح');
        
        // اختبار تسجيل الدخول
        console.log('اختبار تسجيل الدخول...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        assert(loginResponse.status === 200, 'يجب أن تكون استجابة تسجيل الدخول 200');
        assert(loginResponse.data.token, 'يجب أن تحتوي استجابة تسجيل الدخول على رمز');
        authToken = loginResponse.data.token;
        console.log('✅ اختبار تسجيل الدخول ناجح');
        
        // اختبار إعادة تعيين كلمة المرور
        console.log('اختبار إعادة تعيين كلمة المرور...');
        const resetResponse = await axios.post(`${API_URL}/auth/reset-password`, {
            email: testUser.email
        });
        assert(resetResponse.status === 200, 'يجب أن تكون استجابة إعادة تعيين كلمة المرور 200');
        assert(resetResponse.data.message, 'يجب أن تحتوي استجابة إعادة تعيين كلمة المرور على رسالة');
        console.log('✅ اختبار إعادة تعيين كلمة المرور ناجح');
        
        return true;
    } catch (error) {
        console.error('❌ فشل اختبار المصادقة:', error.message);
        return false;
    }
}

// اختبار الإشارات
async function testSignals() {
    console.log('\n=== اختبار الإشارات ===');
    
    try {
        // اختبار الحصول على الإشارات النشطة
        console.log('اختبار الحصول على الإشارات النشطة...');
        const activeSignalsResponse = await axios.get(`${API_URL}/signals?type=active`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        assert(activeSignalsResponse.status === 200, 'يجب أن تكون استجابة الإشارات النشطة 200');
        assert(Array.isArray(activeSignalsResponse.data), 'يجب أن تكون الإشارات النشطة مصفوفة');
        console.log(`عدد الإشارات النشطة: ${activeSignalsResponse.data.length}`);
        console.log('✅ اختبار الحصول على الإشارات النشطة ناجح');
        
        // اختبار الحصول على الإشارات المغلقة
        console.log('اختبار الحصول على الإشارات المغلقة...');
        const closedSignalsResponse = await axios.get(`${API_URL}/signals?type=closed`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        assert(closedSignalsResponse.status === 200, 'يجب أن تكون استجابة الإشارات المغلقة 200');
        assert(Array.isArray(closedSignalsResponse.data), 'يجب أن تكون الإشارات المغلقة مصفوفة');
        console.log(`عدد الإشارات المغلقة: ${closedSignalsResponse.data.length}`);
        console.log('✅ اختبار الحصول على الإشارات المغلقة ناجح');
        
        // اختبار الحصول على إحصائيات الإشارات
        console.log('اختبار الحصول على إحصائيات الإشارات...');
        const statisticsResponse = await axios.get(`${API_URL}/signals/statistics`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        assert(statisticsResponse.status === 200, 'يجب أن تكون استجابة إحصائيات الإشارات 200');
        assert(statisticsResponse.data.totalSignals !== undefined, 'يجب أن تحتوي إحصائيات الإشارات على إجمالي الإشارات');
        assert(statisticsResponse.data.successRate !== undefined, 'يجب أن تحتوي إحصائيات الإشارات على نسبة النجاح');
        console.log(`نسبة نجاح الإشارات: ${statisticsResponse.data.successRate}%`);
        console.log('✅ اختبار الحصول على إحصائيات الإشارات ناجح');
        
        return true;
    } catch (error) {
        console.error('❌ فشل اختبار الإشارات:', error.message);
        return false;
    }
}

// اختبار الأنماط
async function testPatterns() {
    console.log('\n=== اختبار الأنماط ===');
    
    try {
        // اختبار الحصول على أنماط السعر
        console.log('اختبار الحصول على أنماط السعر...');
        const pricePatternsResponse = await axios.get(`${API_URL}/patterns?type=price`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        assert(pricePatternsResponse.status === 200, 'يجب أن تكون استجابة أنماط السعر 200');
        assert(Array.isArray(pricePatternsResponse.data), 'يجب أن تكون أنماط السعر مصفوفة');
        console.log(`عدد أنماط السعر: ${pricePatternsResponse.data.length}`);
        console.log('✅ اختبار الحصول على أنماط السعر ناجح');
        
        // اختبار الحصول على الأنماط المتناغمة
        console.log('اختبار الحصول على الأنماط المتناغمة...');
        const harmonicPatternsResponse = await axios.get(`${API_URL}/patterns?type=harmonic`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        assert(harmonicPatternsResponse.status === 200, 'يجب أن تكون استجابة الأنماط المتناغمة 200');
        assert(Array.isArray(harmonicPatternsResponse.data), 'يجب أن تكون الأنماط المتناغمة مصفوفة');
        console.log(`عدد الأنماط المتناغمة: ${harmonicPatternsResponse.data.length}`);
        console.log('✅ اختبار الحصول على الأنماط المتناغمة ناجح');
        
        // اختبار الحصول على مناطق الانعكاس
        console.log('اختبار الحصول على مناطق الانعكاس...');
        const reversalZonesResponse = await axios.get(`${API_URL}/patterns?type=reversal`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        assert(reversalZonesResponse.status === 200, 'يجب أن تكون استجابة مناطق الانعكاس 200');
        assert(Array.isArray(reversalZonesResponse.data), 'يجب أن تكون مناطق الانعكاس مصفوفة');
        console.log(`عدد مناطق الانعكاس: ${reversalZonesResponse.data.length}`);
        console.log('✅ اختبار الحصول على مناطق الانعكاس ناجح');
        
        return true;
    } catch (error) {
        console.error('❌ فشل اختبار الأنماط:', error.message);
        return false;
    }
}

// اختبار التقويم الاقتصادي
async function testCalendar() {
    console.log('\n=== اختبار التقويم الاقتصادي ===');
    
    try {
        // اختبار الحصول على جميع الأحداث
        console.log('اختبار الحصول على جميع الأحداث...');
        const allEventsResponse = await axios.get(`${API_URL}/calendar`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        assert(allEventsResponse.status === 200, 'يجب أن تكون استجابة جميع الأحداث 200');
        assert(Array.isArray(allEventsResponse.data), 'يجب أن تكون جميع الأحداث مصفوفة');
        console.log(`عدد جميع الأحداث: ${allEventsResponse.data.length}`);
        console.log('✅ اختبار الحصول على جميع الأحداث ناجح');
        
        // اختبار تصفية الأحداث حسب العملة
        console.log('اختبار تصفية الأحداث حسب العملة...');
        const usdEventsResponse = await axios.get(`${API_URL}/calendar?currency=USD`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        assert(usdEventsResponse.status === 200, 'يجب أن تكون استجابة أحداث الدولار الأمريكي 200');
        assert(Array.isArray(usdEventsResponse.data), 'يجب أن تكون أحداث الدولار الأمريكي مصفوفة');
        assert(usdEventsResponse.data.every(event => event.currency === 'USD'), 'يجب أن تكون جميع الأحداث للدولار الأمريكي');
        console.log(`عدد أحداث الدولار الأمريكي: ${usdEventsResponse.data.length}`);
        console.log('✅ اختبار تصفية الأحداث حسب العملة ناجح');
        
        // اختبار تصفية الأحداث حسب التأثير
        console.log('اختبار تصفية الأحداث حسب التأثير...');
        const highImpactEventsResponse = await axios.get(`${API_URL}/calendar?impact=high`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        assert(highImpactEventsResponse.status === 200, 'يجب أن تكون استجابة الأحداث ذات التأثير المرتفع 200');
        assert(Array.isArray(highImpactEventsResponse.data), 'يجب أن تكون الأحداث ذات التأثير المرتفع مصفوفة');
        assert(highImpactEventsResponse.data.every(event => event.impact === 'high'), 'يجب أن تكون جميع الأحداث ذات تأثير مرتفع');
        console.log(`عدد الأحداث ذات التأثير المرتفع: ${highImpactEventsResponse.data.length}`);
        console.log('✅ اختبار تصفية الأحداث حسب التأثير ناجح');
        
        return true;
    } catch (error) {
        console.error('❌ فشل اختبار التقويم الاقتصادي:', error.message);
        return false;
    }
}

// اختبار بيانات الفوركس
async function testForexData() {
    console.log('\n=== اختبار بيانات الفوركس ===');
    
    try {
        // اختبار الحصول على أزواج العملات المتاحة
        console.log('اختبار الحصول على أزواج العملات المتاحة...');
        const pairsResponse = await axios.get(`${API_URL}/forex/pairs`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        assert(pairsResponse.status === 200, 'يجب أن تكون استجابة أزواج العملات 200');
        assert(Array.isArray(pairsResponse.data), 'يجب أن تكون أزواج العملات مصفوفة');
        assert(pairsResponse.data.length > 0, 'يجب أن تحتوي أزواج العملات على عناصر');
        console.log(`عدد أزواج العملات المتاحة: ${pairsResponse.data.length}`);
        console.log('✅ اختبار الحصول على أزواج العملات المتاحة ناجح');
        
        // اختبار الحصول على البيانات التاريخية
        console.log('اختبار الحصول على البيانات التاريخية...');
        const historicalDataResponse = await axios.get(`${API_URL}/forex/historical?pair=EURUSD&timeframe=1h&limit=100`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        assert(historicalDataResponse.status === 200, 'يجب أن تكون استجابة البيانات التاريخية 200');
        assert(Array.isArray(historicalDataResponse.data), 'يجب أن تكون البيانات التاريخية مصفوفة');
        assert(historicalDataResponse.data.length === 100, 'يجب أن تحتوي البيانات التاريخية على 100 عنصر');
        assert(historicalDataResponse.data[0].time !== undefined, 'يجب أن تحتوي البيانات التاريخية على وقت');
        assert(historicalDataResponse.data[0].open !== undefined, 'يجب أن تحتوي البيانات التاريخية على سعر الافتتاح');
        assert(historicalDataResponse.data[0].high !== undefined, 'يجب أن تحتوي البيانات التاريخية على السعر الأعلى');
        assert(historicalDataResponse.data[0].low !== undefined, 'يجب أن تحتوي البيانات التاريخية على السعر الأدنى');
        assert(historicalDataResponse.data[0].close !== undefined, 'يجب أن تحتوي البيانات التاريخية على سعر الإغلاق');
        console.log('✅ اختبار الحصول على البيانات التاريخية ناجح');
        
        return true;
    } catch (error) {
        console.error('❌ فشل اختبار بيانات الفوركس:', error.message);
        return false;
    }
}

// اختبار إعدادات المستخدم
async function testUserSettings() {
    console.log('\n=== اختبار إعدادات المستخدم ===');
    
    try {
        // اختبار الحصول على إعدادات المستخدم
        console.log('اختبار الحصول على إعدادات المستخدم...');
        const settingsResponse = await axios.get(`${API_URL}/user/settings`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        assert(settingsResponse.status === 200, 'يجب أن تكون استجابة إعدادات المستخدم 200');
        assert(settingsResponse.data.account, 'يجب أن تحتوي إعدادات المستخدم على معلومات الحساب');
        assert(settingsResponse.data.notifications, 'يجب أن تحتوي إعدادات المستخدم على إعدادات الإشعارات');
        assert(settingsResponse.data.display, 'يجب أن تحتوي إعدادات المستخدم على إعدادات العرض');
        console.log('✅ اختبار الحصول على إعدادات المستخدم ناجح');
        
        // اختبار تحديث إعدادات المستخدم
        console.log('اختبار تحديث إعدادات المستخدم...');
        const updatedSettings = {
            display: {
                theme: 'light',
                chartStyle: 'line',
                defaultTimeframe: '4h',
                defaultPair: 'GBPUSD'
            }
        };
        const updateResponse = await axios.put(`${API_URL}/user/settings`, updatedSettings, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        assert(updateResponse.status === 200, 'يجب أن تكون استجابة تحديث إعدادات المستخدم 200');
        assert(updateResponse.data.display.theme === 'light', 'يجب أن تكون السمة المحدثة "light"');
        assert(updateResponse.data.display.chartStyle === 'line', 'يجب أن يكون نمط الرسم البياني المحدث "line"');
        assert(updateResponse.data.display.defaultTimeframe === '4h', 'يجب أن يكون الإطار الزمني الافتراضي المحدث "4h"');
        assert(updateResponse.data.display.defaultPair === 'GBPUSD', 'يجب أن يكون زوج العملات الافتراضي المحدث "GBPUSD"');
        console.log('✅ اختبار تحديث إعدادات المستخدم ناجح');
        
        return true;
    } catch (error) {
        console.error('❌ فشل اختبار إعدادات المستخدم:', error.message);
        return false;
    }
}

// اختبار WebSocket
async function testWebSocket() {
    console.log('\n=== اختبار WebSocket ===');
    
    return new Promise((resolve) => {
        try {
            console.log('اختبار اتصال WebSocket...');
            const ws = new WebSocket(WS_URL);
            
            ws.on('open', () => {
                console.log('✅ اتصال WebSocket ناجح');
                
                // اختبار الاشتراك في الإشارات
                console.log('اختبار الاشتراك في الإشارات...');
                ws.send(JSON.stringify({ type: 'subscribe', channel: 'signals' }));
                
                // اختبار الاشتراك في تحديثات الأسعار
                console.log('اختبار الاشتراك في تحديثات الأسعار...');
                ws.send(JSON.stringify({ type: 'subscribe', channel: 'prices', pair: 'EURUSD' }));
                
                // انتظار الردود
                setTimeout(() => {
                    // اختبار إلغاء الاشتراك
                    console.log('اختبار إلغاء الاشتراك من الإشارات...');
                    ws.send(JSON.stringify({ type: 'unsubscribe', channel: 'signals' }));
                    
                    console.log('اختبار إلغاء الاشتراك من تحديثات الأسعار...');
                    ws.send(JSON.stringify({ type: 'unsubscribe', channel: 'prices', pair: 'EURUSD' }));
                    
                    // إغلاق الاتصال بعد 2 ثانية
                    setTimeout(() => {
                        ws.close();
                        console.log('✅ اختبار WebSocket ناجح');
                        resolve(true);
                    }, 2000);
                }, 5000);
            });
            
            ws.on('message', (data) => {
                const message = JSON.parse(data);
                console.log(`استلام رسالة WebSocket: ${message.type}`);
                
                if (message.type === 'subscription') {
                    console.log(`✅ اشتراك ناجح في ${message.channel}`);
                } else if (message.type === 'unsubscription') {
                    console.log(`✅ إلغاء اشتراك ناجح من ${message.channel}`);
                } else if (message.type === 'price') {
                    console.log(`✅ استلام تحديث سعر لـ ${message.data.pair}: ${message.data.price}`);
                } else if (message.type === 'signal') {
                    console.log(`✅ استلام إشارة جديدة: ${message.data.pair} ${message.data.type}`);
                }
            });
            
            ws.on('error', (error) => {
                console.error('❌ خطأ في WebSocket:', error.message);
                resolve(false);
            });
            
            ws.on('close', () => {
                console.log('اتصال WebSocket مغلق');
            });
        } catch (error) {
            console.error('❌ فشل اختبار WebSocket:', error.message);
            resolve(false);
        }
    });
}

// تشغيل جميع الاختبارات
async function runAllTests() {
    console.log('بدء اختبارات تطبيق كوكبة تاسي لسحر الأرقام والتوصيات الذكية...\n');
    
    const authSuccess = await testAuthentication();
    if (!authSuccess) {
        console.error('❌ فشل اختبار المصادقة، توقف الاختبار');
        return;
    }
    
    const signalsSuccess = await testSignals();
    const patternsSuccess = await testPatterns();
    const calendarSuccess = await testCalendar();
    const forexDataSuccess = await testForexData();
    const userSettingsSuccess = await testUserSettings();
    const webSocketSuccess = await testWebSocket();
    
    console.log('\n=== نتائج الاختبار ===');
    console.log(`المصادقة: ${authSuccess ? '✅ ناجح' : '❌ فاشل'}`);
    console.log(`الإشارات: ${signalsSuccess ? '✅ ناجح' : '❌ فاشل'}`);
    console.log(`الأنماط: ${patternsSuccess ? '✅ ناجح' : '❌ فاشل'}`);
    console.log(`التقويم الاقتصادي: ${calendarSuccess ? '✅ ناجح' : '❌ فاشل'}`);
    console.log(`بيانات الفوركس: ${forexDataSuccess ? '✅ ناجح' : '❌ فاشل'}`);
    console.log(`إعدادات المستخدم: ${userSettingsSuccess ? '✅ ناجح' : '❌ فاشل'}`);
    console.log(`WebSocket: ${webSocketSuccess ? '✅ ناجح' : '❌ فاشل'}`);
    
    const allSuccess = authSuccess && signalsSuccess && patternsSuccess && calendarSuccess && forexDataSuccess && userSettingsSuccess && webSocketSuccess;
    console.log(`\nالنتيجة النهائية: ${allSuccess ? '✅ جميع الاختبارات ناجحة' : '❌ بعض الاختبارات فاشلة'}`);
}

// تشغيل الاختبارات
runAllTests();
