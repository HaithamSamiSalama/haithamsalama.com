// بيانات الدخول
const CORRECT_USERNAME = 'admin';
const CORRECT_PASSWORD = 'Lara@2014';

// عناصر الـ DOM
const loginContainer = document.getElementById('loginContainer');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');
const logoutBtn = document.getElementById('logoutBtn');

// عناصر الملفات
const fileNameInput = document.getElementById('fileName');
const fileLinkInput = document.getElementById('fileLink');
const fileDescInput = document.getElementById('fileDesc');
const addFileBtn = document.getElementById('addFileBtn');
const cancelEditFileBtn = document.getElementById('cancelEditFileBtn');
const filesList = document.getElementById('filesList');
const fileSuccessMsg = document.getElementById('fileSuccessMsg');

// عناصر البرامج
const programNameArInput = document.getElementById('programNameAr');
const programNameEnInput = document.getElementById('programNameEn');
const programDescInput = document.getElementById('programDesc');
const programVideoLinkInput = document.getElementById('programVideoLink');
const programDownloadLinkInput = document.getElementById('programDownloadLink');
const programImageInput = document.getElementById('programImage');
const imagePreview = document.getElementById('imagePreview');
const addProgramBtn = document.getElementById('addProgramBtn');
const cancelEditProgramBtn = document.getElementById('cancelEditProgramBtn');
const programsList = document.getElementById('programsList');
const programSuccessMsg = document.getElementById('programSuccessMsg');

// متغيرات الحالة
let currentEditingFileId = null;
let currentEditingProgramId = null;
let filesData = [];
let programsData = [];

// تحميل البيانات عند بدء الصفحة
document.addEventListener('DOMContentLoaded', function() {
    loadFilesData();
    loadProgramsData();
});

// معالجة تسجيل الدخول
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
        loginContainer.style.display = 'none';
        dashboard.style.display = 'block';
        renderFiles();
        renderPrograms();
    } else {
        errorMsg.style.display = 'block';
        setTimeout(() => errorMsg.style.display = 'none', 3000);
    }
});

// معالجة تسجيل الخروج
logoutBtn.addEventListener('click', function() {
    loginContainer.style.display = 'flex';
    dashboard.style.display = 'none';
    loginForm.reset();
    document.getElementById('username').focus();
});

// معالجة التبويبات
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        document.getElementById(this.dataset.tab + '-tab').classList.add('active');
    });
});

// ===== عمليات الملفات =====

function loadFilesData() {
    const stored = localStorage.getItem('filesData');
    filesData = stored ? JSON.parse(stored) : [];
}

function saveFilesData() {
    localStorage.setItem('filesData', JSON.stringify(filesData));
}

function renderFiles() {
    filesList.innerHTML = '';
    
    if (filesData.length === 0) {
        filesList.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">لا توجد ملفات</p>';
        return;
    }

    filesData.forEach((file, index) => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-info">
                <div class="item-name">${file.name}</div>
                <div class="item-details"><strong>الوصف:</strong> ${file.description}</div>
                <div class="item-details"><strong>الرابط:</strong> <a href="${file.link}" target="_blank">${file.link}</a></div>
            </div>
            <div class="item-actions">
                <button class="btn btn-update btn-sm" onclick="editFile(${index})">تعديل</button>
                <button class="btn btn-delete btn-sm" onclick="deleteFile(${index})">حذف</button>
            </div>
        `;
        filesList.appendChild(card);
    });
}

addFileBtn.addEventListener('click', function() {
    if (!fileNameInput.value || !fileLinkInput.value) {
        alert('يرجى ملء الحقول المطلوبة');
        return;
    }

    if (currentEditingFileId !== null) {
        // تحديث ملف موجود
        filesData[currentEditingFileId] = {
            name: fileNameInput.value,
            link: fileLinkInput.value,
            description: fileDescInput.value
        };
        currentEditingFileId = null;
        cancelEditFileBtn.style.display = 'none';
        addFileBtn.textContent = 'إضافة ملف';
    } else {
        // إضافة ملف جديد
        filesData.push({
            name: fileNameInput.value,
            link: fileLinkInput.value,
            description: fileDescInput.value
        });
    }

    saveFilesData();
    renderFiles();
    fileNameInput.value = '';
    fileLinkInput.value = '';
    fileDescInput.value = '';
    showSuccessMessage('fileSuccessMsg');
});

function editFile(index) {
    const file = filesData[index];
    fileNameInput.value = file.name;
    fileLinkInput.value = file.link;
    fileDescInput.value = file.description;
    currentEditingFileId = index;
    cancelEditFileBtn.style.display = 'block';
    addFileBtn.textContent = 'تحديث الملف';
    fileNameInput.focus();
}

function deleteFile(index) {
    if (confirm('هل تريد حذف هذا الملف؟')) {
        filesData.splice(index, 1);
        saveFilesData();
        renderFiles();
        showSuccessMessage('fileSuccessMsg', 'تم الحذف بنجاح');
    }
}

cancelEditFileBtn.addEventListener('click', function() {
    fileNameInput.value = '';
    fileLinkInput.value = '';
    fileDescInput.value = '';
    currentEditingFileId = null;
    cancelEditFileBtn.style.display = 'none';
    addFileBtn.textContent = 'إضافة ملف';
});

// ===== عمليات البرامج =====

function loadProgramsData() {
    const stored = localStorage.getItem('programsData');
    programsData = stored ? JSON.parse(stored) : [];
}

function saveProgramsData() {
    localStorage.setItem('programsData', JSON.stringify(programsData));
}

function renderPrograms() {
    programsList.innerHTML = '';
    
    if (programsData.length === 0) {
        programsList.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">لا توجد برامج</p>';
        return;
    }

    programsData.forEach((program, index) => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-info">
                <div class="item-name">${program.nameAr} - ${program.nameEn}</div>
                <div class="item-details"><strong>الوصف:</strong> ${program.description}</div>
                <div class="item-details"><strong>الفيديو:</strong> <a href="${program.videoLink}" target="_blank">شاهد</a></div>
                <div class="item-details"><strong>التحميل:</strong> <a href="${program.downloadLink}" target="_blank">حمّل</a></div>
                ${program.image ? `<img src="${program.image}" style="max-width: 80px; margin-top: 10px; border-radius: 5px;">` : ''}
            </div>
            <div class="item-actions">
                <button class="btn btn-update btn-sm" onclick="editProgram(${index})">تعديل</button>
                <button class="btn btn-delete btn-sm" onclick="deleteProgram(${index})">حذف</button>
            </div>
        `;
        programsList.appendChild(card);
    });
}

// معالجة اختيار الصورة
programImageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            compressImage(event.target.result, function(compressedImage) {
                imagePreview.src = compressedImage;
                imagePreview.style.display = 'block';
            });
        };
        reader.readAsDataURL(file);
    }
});

// ضغط الصورة
function compressImage(src, callback) {
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // الحد الأقصى للعرض 400px
        if (width > 400) {
            height = Math.round((height * 400) / width);
            width = 400;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // رسم الصورة أولاً للتحقق من الشفافية
        ctx.drawImage(img, 0, 0, width, height);
        
        // التحقق من وجود شفافية
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        let hasTransparency = false;
        
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] < 255) { // alpha < 255
                hasTransparency = true;
                break;
            }
        }
        
        // إعادة رسم الصورة
        ctx.clearRect(0, 0, width, height);
        
        if (hasTransparency) {
            // إذا كانت الصورة شفافة، ضغط إلى PNG بدون خلفية
            ctx.drawImage(img, 0, 0, width, height);
            callback(canvas.toDataURL('image/png'));
        } else {
            // إذا لم تكن شفافة، ملء الخلفية بيضاء وضغط إلى JPEG
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            callback(canvas.toDataURL('image/jpeg', 0.8));
        }
    };
    img.src = src;
}

addProgramBtn.addEventListener('click', function() {
    if (!programNameArInput.value || !programNameEnInput.value || !programVideoLinkInput.value || !programDownloadLinkInput.value) {
        alert('يرجى ملء الحقول المطلوبة');
        return;
    }

    const programData = {
        nameAr: programNameArInput.value,
        nameEn: programNameEnInput.value,
        description: programDescInput.value,
        videoLink: programVideoLinkInput.value,
        downloadLink: programDownloadLinkInput.value,
        image: imagePreview.src || ''
    };

    if (currentEditingProgramId !== null) {
        // تحديث برنامج موجود
        programsData[currentEditingProgramId] = programData;
        currentEditingProgramId = null;
        cancelEditProgramBtn.style.display = 'none';
        addProgramBtn.textContent = 'إضافة برنامج';
    } else {
        // إضافة برنامج جديد
        programsData.push(programData);
    }

    saveProgramsData();
    renderPrograms();
    resetProgramForm();
    showSuccessMessage('programSuccessMsg');
});

function editProgram(index) {
    const program = programsData[index];
    programNameArInput.value = program.nameAr;
    programNameEnInput.value = program.nameEn;
    programDescInput.value = program.description;
    programVideoLinkInput.value = program.videoLink;
    programDownloadLinkInput.value = program.downloadLink;
    
    if (program.image) {
        imagePreview.src = program.image;
        imagePreview.style.display = 'block';
    }
    
    currentEditingProgramId = index;
    cancelEditProgramBtn.style.display = 'block';
    addProgramBtn.textContent = 'تحديث البرنامج';
    programNameArInput.focus();
}

function deleteProgram(index) {
    if (confirm('هل تريد حذف هذا البرنامج؟')) {
        programsData.splice(index, 1);
        saveProgramsData();
        renderPrograms();
        showSuccessMessage('programSuccessMsg', 'تم الحذف بنجاح');
    }
}

cancelEditProgramBtn.addEventListener('click', function() {
    resetProgramForm();
    currentEditingProgramId = null;
    cancelEditProgramBtn.style.display = 'none';
    addProgramBtn.textContent = 'إضافة برنامج';
});

function resetProgramForm() {
    programNameArInput.value = '';
    programNameEnInput.value = '';
    programDescInput.value = '';
    programVideoLinkInput.value = '';
    programDownloadLinkInput.value = '';
    programImageInput.value = '';
    imagePreview.style.display = 'none';
    imagePreview.src = '';
}

// عرض رسالة النجاح
function showSuccessMessage(elementId, message = 'تم العملية بنجاح') {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => element.style.display = 'none', 3000);
}
