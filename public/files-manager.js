const db = window.db || (window.firebase && window.firebase.firestore ? window.firebase.firestore() : null);

// تحميل بيانات الملفات من Cloud Firestore
async function loadFilesFromFirestore() {
    if (!db) {
        const tableBody = document.querySelector('.course-table tbody');
        const firebaseLoaded = typeof window.firebase !== 'undefined';
        const message = firebaseLoaded
            ? 'Firestore غير معرف. تأكد من أن مكتبة firebase-firestore-compat محملة.'
            : 'Firebase غير محمّل. تأكد من تحميل مكتبات Firebase قبل config-firebase.js.';
        if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: red;">${message}</td></tr>`;
        }
        console.error(message);
        return;
    }

    try {
        const querySnapshot = await db.collection('files').orderBy('id').get();
        const filesArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        displayFilesInTable(filesArray);
    } catch (error) {
        console.error('خطأ في تحميل الملفات من Firestore:', error);
        const tableBody = document.querySelector('.course-table tbody');
        if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: red;">فشل تحميل البيانات من Firestore: ${error.message}</td></tr>`;
        }
    }
}

// عرض الملفات في الجدول
function displayFilesInTable(files) {
    const tableBody = document.querySelector('.course-table tbody');
    
    if (!tableBody) return;
    
    // مسح محتوى الجدول القديم
    tableBody.innerHTML = '';
    
    // إضافة كل ملف كصف في الجدول
    files.forEach((file, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${file.name || 'بدون اسم'}</td>
            <td>${file.description || 'بدون وصف'}</td>
            <td>
                <a href="${file.downloadUrl || '#'}" 
                   target="_blank" 
                   class="download-btn" 
                   ${file.downloadUrl ? 'download' : 'style="pointer-events: none; opacity: 0.5;"'}>
                   تحميل الملف
                </a>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // إذا لم تكن هناك ملفات
    if (files.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">لا توجد ملفات للعرض</td></tr>';
    }
}

// قراءة البيانات من JSON محلي (نسخة احتياطية)
async function loadFilesFromJSON() {
    try {
        const response = await fetch('./data/files.json');
        
        if (!response.ok) {
            throw new Error('فشل تحميل ملف البيانات');
        }
        
        const data = await response.json();
        displayFilesInTable(data.files || data);
    } catch (error) {
        console.error('خطأ في تحميل البيانات:', error);
    }
}

// تحميل البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    if (window.firebase) {
        loadFilesFromFirestore();
    } else {
        loadFilesFromJSON();
    }
});
