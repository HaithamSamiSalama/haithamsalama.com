// ملف مساعد لتحديث محتويات الملفات والبرامج من لوحة التحكم

// تحديث محتوى صفحة الملفات
function loadFilesFromAdmin() {
    const filesData = localStorage.getItem('filesData');
    if (!filesData) return;

    const files = JSON.parse(filesData);
    const filesContainer = document.querySelector('#files-container') || 
                          document.querySelector('[data-files-container]');
    
    if (!filesContainer) return;

    let html = '';
    files.forEach((file, index) => {
        html += `
            <div style="text-align: center; border: 2px solid #f59e42; border-radius: 10px; padding: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); width: 250px; height: auto; margin: 15px auto;">
                <div style="font-size: 3rem; margin-bottom: 10px;">📄</div>
                <h5 style="margin: 10px 0; font-size: 1.1rem; color: #0a2e73;">${file.name}</h5>
                <p style="font-size: 0.95rem; color: #555; margin: 8px 0;">${file.description}</p>
                <a href="${file.link}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">تحميل</a>
            </div>
        `;
    });

    if (html) {
        filesContainer.innerHTML = html;
    }
}

// تحديث محتوى صفحة البرامج
function loadProgramsFromAdmin() {
    const programsData = localStorage.getItem('programsData');
    if (!programsData) return;

    const programs = JSON.parse(programsData);
    const programsContainer = document.querySelector('#programs-container') || 
                             document.querySelector('[data-programs-container]');
    
    if (!programsContainer) return;

    let html = '';
    programs.forEach((program, index) => {
        html += `
            <div class="program-frame">
                <div class="program-content image-box">
                    ${program.image ? 
                        `<img src="${program.image}" alt="${program.nameAr}" class="program-image">` :
                        `<img src="images/placeholder.png" alt="${program.nameAr}" class="program-image">`
                    }
                </div>

                <div class="program-content text-box">
                    <div class="titles">
                        <h3>${program.nameAr}</h3>
                        <h2>${program.nameEn}</h2>
                    </div>

                    <div class="description">
                        <p>${program.description}</p>
                    </div>

                    <div class="buttons">
                        <a href="${program.videoLink}" target="_blank" class="btn btn-blue">
                            مشاهدة الفيديو التوضيحي - يوتيوب
                        </a>

                        <a href="${program.downloadLink}" target="_blank" class="btn btn-purple">
                            تحميل الآن - Download Now
                        </a>
                    </div>
                </div>
            </div>
        `;
    });

    if (html) {
        programsContainer.innerHTML = html;
    }
}

// تحميل البيانات عند بدء الصفحة
document.addEventListener('DOMContentLoaded', function() {
    loadFilesFromAdmin();
    loadProgramsFromAdmin();
});
