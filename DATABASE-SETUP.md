# نظام إدارة الملفات - دليل الاستخدام

## نظرة عامة

تم إنشاء نظام ديناميكي لإدارة ملفات الموقع بدلاً من الكود الثابت في HTML.

## الملفات المنشأة

### 1. **files-manager.js**

- ملف JavaScript يحمل بيانات الملفات من قاعدة البيانات
- يعرض البيانات ديناميكياً في جدول الملفات
- يدعم نوعين من مصادر البيانات:
  - Firebase Realtime Database
  - ملف JSON محلي

### 2. **data/files.json**

- ملف JSON يحتوي على بيانات الملفات
- البنية الحالية:
  ```json
  {
    "files": [
      {
        "id": 1,
        "name": "اسم الملف",
        "description": "وصف الملف",
        "downloadUrl": "رابط التحميل"
      }
    ]
  }
  ```

### 3. **config-firebase.js** (اختياري)

- ملف إعدادات Firebase
- استخدمه فقط إذا أردت الاتصال بـ Firebase Realtime Database

### 4. **files.html**

- تم تعديلها لاستخدام البيانات الديناميكية
- إزالة الصفوف الثابتة من الجدول

---

## طريقة الاستخدام

### الخيار 1: استخدام ملف JSON محلي (الأسهل والموصى به)

1. **تعديل البيانات**: عدّل ملف `data/files.json` بإضافة أو تحديث الملفات
2. **الحفظ**: حفظ الملف تلقائياً يحدث الصفحة

#### مثال على إضافة ملف جديد:

```json
{
  "files": [
    {
      "id": 1,
      "name": "اسم الملف الأول",
      "description": "وصف الملف الأول",
      "downloadUrl": "https://example.com/file1.pdf"
    },
    {
      "id": 2,
      "name": "اسم الملف الثاني",
      "description": "وصف الملف الثاني",
      "downloadUrl": "https://example.com/file2.docx"
    }
  ]
}
```

---

### الخيار 2: استخدام Firebase Realtime Database (للمشاريع الكبيرة)

#### خطوات الإعداد:

1. **إنشاء قاعدة بيانات في Firebase Console:**
   - ادخل إلى https://console.firebase.google.com
   - افتح مشروعك
   - اختر "Realtime Database" من القائمة الجانبية
   - اختر "Create Database"

2. **إضافة بيانات الملفات:**
   - أنشئ node باسم "files"
   - أضف البيانات بالصيغة التالية:

   ```
   files
   ├── 0
   │   ├── id: 1
   │   ├── name: "اسم الملف"
   │   ├── description: "وصف الملف"
   │   └── downloadUrl: "https://example.com/file"
   ├── 1
   │   └── ...
   ```

3. **تحديث ملف config-firebase.js:**
   - استبدل `YOUR_API_KEY` بـ API Key من Firebase
   - استبدل `YOUR_PROJECT` باسم مشروعك
   - استبدل باقي البيانات

4. **تفعيل Firebase:**
   - أضف هذه الأسطر قبل `</head>` في `files.html`:

   ```html
   <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js"></script>
   <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js"></script>
   <script src="config-firebase.js"></script>
   ```

   - عدّل السطر في `files-manager.js` من:

   ```javascript
   loadFilesFromJSON();
   ```

   إلى:

   ```javascript
   loadFilesFromDatabase();
   ```

---

## إضافة ملف جديد

### عند استخدام JSON المحلي:

```json
{
  "id": 6,
  "name": "اسم الملف الجديد",
  "description": "وصف تفصيلي للملف",
  "downloadUrl": "https://www.mediafire.com/... أو أي رابط آخر"
}
```

### عند استخدام Firebase:

- أضفه مباشرة من Firebase Console أو برمجياً من لوحة تحكم

---

## حقول البيانات

| الحقل       | النوع | الوصف            |
| ----------- | ----- | ---------------- |
| id          | رقم   | معرف فريد للملف  |
| name        | نص    | اسم الملف        |
| description | نص    | وصف تفصيلي للملف |
| downloadUrl | رابط  | رابط التحميل     |

---

## استكشاف الأخطاء

### الجدول فارغ

- تحقق من صحة ملف JSON
- تأكد من أن `data/files.json` موجود
- افتح أدوات المطور (F12) وشاهد رسائل الخطأ

### خطأ "CORS"

- هذا يعني أن رابط البيانات غير محمي
- استخدم JSON المحلي بدلاً من Firebase

### رابط التحميل لا يعمل

- تحقق من أن الرابط صحيح
- تأكد من أن الملف لا يزال موجوداً على الخادم

---

## ملاحظات مهمة

✅ **مميزات النظام:**

- سهل التحديث بدون تعديل HTML
- يدعم عدد غير محدود من الملفات
- سريع وآمن

⚠️ **نقاط مهمة:**

- JSON المحلي أسهل للاستخدام البسيط
- Firebase أفضل إذا كنت تريد تحديثات real-time
- تأكد من أن بيانات الملفات منسقة بشكل صحيح

---

## الدعم والمساعدة

إذا واجهت مشكلة:

1. تحقق من صحة JSON (استخدم https://jsonlint.com/)
2. افتح أدوات المطور (F12) وشاهد رسائل الأخطاء
3. تأكد من أن الملفات موجودة في المكان الصحيح
