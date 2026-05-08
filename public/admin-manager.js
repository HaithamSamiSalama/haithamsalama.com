const loginForm = document.getElementById('login-form');
const authEmailInput = document.getElementById('admin-email');
const authPasswordInput = document.getElementById('admin-password');
const authMessage = document.getElementById('auth-message');
const signOutButton = document.getElementById('sign-out-btn');
const adminContainer = document.getElementById('admin-container');
const loginContainer = document.getElementById('login-container');
const adminForm = document.getElementById('admin-form');
const fileNameInput = document.getElementById('file-name');
const fileDescriptionInput = document.getElementById('file-description');
const fileDownloadInput = document.getElementById('file-download');
const filesBody = document.getElementById('admin-files-body');
const statusElement = document.getElementById('admin-status');
const cancelEditButton = document.getElementById('cancel-edit-btn');
const db = window.db || (window.firebase && window.firebase.firestore ? window.firebase.firestore() : null);
const auth = window.firebase && window.firebase.auth ? window.firebase.auth() : null;
const ADMIN_EMAIL = 'admin@haithamsalama.com';
const ADMIN_PASSWORD = 'Lara@2014';

let currentDocId = null;
let currentFiles = [];

function showStatus(message, isError = false) {
  statusElement.textContent = message;
  statusElement.style.display = 'block';
  statusElement.style.background = isError ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)';
  statusElement.style.color = isError ? '#991b1b' : '#047857';
  setTimeout(() => {
    statusElement.style.display = 'none';
  }, 4000);
}

function showAuthMessage(message, isError = false) {
  authMessage.textContent = message;
  authMessage.style.display = 'block';
  authMessage.style.background = isError ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)';
  authMessage.style.color = isError ? '#991b1b' : '#047857';
  setTimeout(() => {
    authMessage.style.display = 'none';
  }, 4000);
}

function toggleAdminView(isAuthenticated) {
  adminContainer.style.display = isAuthenticated ? 'block' : 'none';
  loginContainer.style.display = isAuthenticated ? 'none' : 'block';
  signOutButton.style.display = isAuthenticated ? 'inline-flex' : 'none';
}

function resetForm() {
  currentDocId = null;
  fileNameInput.value = '';
  fileDescriptionInput.value = '';
  fileDownloadInput.value = '';
  document.querySelector('.btn-save').textContent = 'حفظ الملف';
}

function renderFilesTable(files) {
  filesBody.innerHTML = '';
  if (!files.length) {
    filesBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #374151;">لا توجد ملفات في قاعدة البيانات</td></tr>';
    return;
  }

  files.forEach((file, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${file.name || ''}</td>
      <td>${file.description || ''}</td>
      <td><a href="${file.downloadUrl || '#'}" target="_blank" style="color: #0a2e73; text-decoration: none;">رابط</a></td>
      <td>
        <button class="btn-edit" data-id="${file.docId}">تعديل</button>
        <button class="btn-delete" data-id="${file.docId}">حذف</button>
      </td>
    `;
    filesBody.appendChild(row);
  });
}

function bindTableActions() {
  filesBody.querySelectorAll('.btn-edit').forEach(button => {
    button.addEventListener('click', async () => {
      const docId = button.dataset.id;
      await editFile(docId);
    });
  });

  filesBody.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', async () => {
      const docId = button.dataset.id;
      if (confirm('هل أنت متأكد من حذف هذا الملف؟')) {
        await deleteFile(docId);
      }
    });
  });
}

async function fetchFiles() {
  if (!db) {
    showStatus('Firestore غير معرف. تأكد من تحميل config-firebase.js بعد مكتبات Firebase.', true);
    return;
  }

  try {
    const snapshot = await db.collection('files').orderBy('id').get();
    currentFiles = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
    renderFilesTable(currentFiles);
    bindTableActions();
  } catch (error) {
    console.error('خطأ في جلب الملفات:', error);
    showStatus(`حدث خطأ أثناء جلب الملفات من Firestore: ${error.message}`, true);
  }
}

async function editFile(docId) {
  if (!db) {
    showStatus('Firestore غير معرف. تأكد من تحميل config-firebase.js بعد مكتبات Firebase.', true);
    return;
  }

  try {
    const doc = await db.collection('files').doc(docId).get();
    if (!doc.exists) {
      showStatus('الملف غير موجود.', true);
      return;
    }
    const data = doc.data();
    currentDocId = docId;
    fileNameInput.value = data.name || '';
    fileDescriptionInput.value = data.description || '';
    fileDownloadInput.value = data.downloadUrl || '';
    document.querySelector('.btn-save').textContent = 'تحديث الملف';
  } catch (error) {
    console.error('خطأ في تحميل بيانات التعديل:', error);
    showStatus('حدث خطأ أثناء تحميل بيانات التعديل.', true);
  }
}

async function deleteFile(docId) {
  if (!db) {
    showStatus('Firestore غير معرف. تأكد من تحميل config-firebase.js بعد مكتبات Firebase.', true);
    return;
  }

  try {
    await db.collection('files').doc(docId).delete();
    showStatus('تم حذف الملف بنجاح.');
    await fetchFiles();
    resetForm();
  } catch (error) {
    console.error('خطأ في حذف الملف:', error);
    showStatus('حدث خطأ أثناء حذف الملف.', true);
  }
}

function getNextFileId() {
  const maxId = currentFiles.reduce((max, file) => {
    const id = Number(file.id) || 0;
    return id > max ? id : max;
  }, 0);
  return maxId + 1;
}

adminForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!db) {
    showStatus('Firestore غير معرف. تأكد من تحميل config-firebase.js بعد مكتبات Firebase.', true);
    return;
  }

  const name = fileNameInput.value.trim();
  const description = fileDescriptionInput.value.trim();
  const downloadUrl = fileDownloadInput.value.trim();

  if (!name || !downloadUrl) {
    showStatus('الرجاء إدخال اسم الملف ورابط التحميل.', true);
    return;
  }

  try {
    if (currentDocId) {
      await db.collection('files').doc(currentDocId).update({
        name,
        description,
        downloadUrl,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      showStatus('تم تحديث الملف بنجاح.');
    } else {
      const newId = getNextFileId();
      await db.collection('files').add({
        id: newId,
        name,
        description,
        downloadUrl,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      showStatus('تم إضافة الملف بنجاح.');
    }

    await fetchFiles();
    resetForm();
  } catch (error) {
    console.error('خطأ في حفظ الملف:', error);
    showStatus(`حدث خطأ أثناء حفظ الملف: ${error.message}`, true);
  }
});

cancelEditButton.addEventListener('click', event => {
  event.preventDefault();
  resetForm();
});

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!auth) {
    showAuthMessage('Firebase Auth غير متاحة. تأكد من تحميل firebase-auth-compat.js.', true);
    return;
  }

  const email = authEmailInput.value.trim();
  const password = authPasswordInput.value.trim();

  if (!email || !password) {
    showAuthMessage('الرجاء إدخال البريد الإلكتروني وكلمة المرور.', true);
    return;
  }

  try {
    await auth.signInWithEmailAndPassword(email, password);
    showAuthMessage('تم تسجيل الدخول بنجاح. جارى تحميل لوحة التحكم...');
    authEmailInput.value = '';
    authPasswordInput.value = '';
  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    showAuthMessage(`فشل تسجيل الدخول: ${error.message}`, true);
  }
});

signOutButton.addEventListener('click', async () => {
  if (!auth) return;
  try {
    await auth.signOut();
    toggleAdminView(false);
    showAuthMessage('تم تسجيل الخروج بنجاح.');
  } catch (error) {
    console.error('خطأ أثناء تسجيل الخروج:', error);
    showAuthMessage('حدث خطأ أثناء تسجيل الخروج.', true);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (!auth) {
    toggleAdminView(false);
    showAuthMessage('Firebase Auth غير متاحة. تأكد من تحميل firebase-auth-compat.js.', true);
    return;
  }

  if (!authEmailInput.value && !authPasswordInput.value) {
    authEmailInput.value = ADMIN_EMAIL;
    authPasswordInput.value = ADMIN_PASSWORD;
  }

  auth.onAuthStateChanged(user => {
    if (user) {
      toggleAdminView(true);
      if (!db) {
        showStatus('Firestore غير معرف. تأكد من تحميل config-firebase.js بعد مكتبات Firebase.', true);
        return;
      }
      fetchFiles();
    } else {
      toggleAdminView(false);
    }
  });
});
