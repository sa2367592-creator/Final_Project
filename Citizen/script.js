// Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('active');
}

// Toast Notification System
function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;

    let icon = 'fa-check-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    if (type === 'danger') icon = 'fa-times-circle';

    toast.innerHTML = `
        <div class="notification-icon text-${type}">
            <i class="fas ${icon}"></i>
        </div>
        <div class="notification-content">
            <p class="m-0 fw-bold">${message}</p>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// Activate File Uploads
document.addEventListener('change', function (e) {
    if (e.target && e.target.type === 'file') {
        const fileName = e.target.files[0] ? e.target.files[0].name : '';
        if (fileName) {
            showToast(`تم رفع الملف: ${fileName}`, 'success');
            // Update the display if there's a related label
            const label = e.target.closest('.file-upload-wrapper')?.querySelector('.btn-upload span');
            if (label) label.textContent = fileName;
        }
    }
});

// Activate Form Submissions (Demo)
document.addEventListener('submit', function (e) {
    // Only intercept if we don't want real navigation for demo
    if (e.target.tagName === 'FORM' && !e.target.action.includes('.html')) {
        e.preventDefault();
        showToast('تم إرسال الطلب بنجاح', 'success');
    } else if (e.target.tagName === 'FORM') {
        const btn = e.target.querySelector('button[type="submit"]');
        if (btn) {
            // For real navigation, show toast then wait 1s
            e.preventDefault();
            showToast('جاري التحميل...', 'info');
            setTimeout(() => e.target.submit(), 1000);
        }
    }
});

// Governorate and District Data
const locationData = {
    "أمانة العاصمة": ["شعوب", "معين", "السبعين", "آزال", "الوحدة", "التحرير", "الصافية", "بني الحارث", "الثورة"],
    "صنعاء": ["سنحان وبني بهلول", "بني حشيش", "همدان", "أرحب", "نهم", "مناخة", "الحيمة الداخلية", "الحيمة الخارجية", "بني مطر", "بلاد الروس", "جحانة", "خولان", "الطيال", "صفان", "بني ضبيان"],
    "عدن": ["صيرة", "كريتر", "المعلا", "التواهي", "خور مكسر", "الشيخ عثمان", "المنصورة", "دار سعد"],
    "تعز": ["المظفر", "القاهرة", "صالة", "المعافر", "المواسط", "شرعب السلام", "شرعب الرونة", "مقبنة", "ماوية", "جبل حبشي", "المسراخ", "سامع", "خدير", "حيفان", "ذباب", "المخا", "موزع", "الوازعية"],
    "الحديدة": ["الحوك", "الميناء", "الحالي", "الزيدية", "بيت الفقيه", "زبيد", "الجراحي", "التحيتا", "الدريهمي", "باجل", "المنيرة", "الصليف", "اللحية", "القناوص", "كمران"],
    "إب": ["إب", "الظهار", "العدين", "فرع العدين", "حبيش", "ذي السفال", "السياني", "يريم", "السدة", "النادرة", "القفر", "الرضمة", "مذيخرة", "بعدان", "الشعر", "المخادر", "السبرة"],
    "ذمار": ["ذمار", "مغرب عنس", "عنس", "الحدا", "جهران", "وصاب العالي", "وصاب السافل", "عتمة", "ميفعة عنس", "جبل الشرق"],
    "البيضاء": ["رداع", "رداع العرش", "القريشية", "ولد ربيع", "الزاهر", "الطفة", "نعمان", "مكيراس", "السوادية", "الصومعة", "ذي ناعم", "مسورة"],
    "مأرب": ["مأرب", "الوادي", "صرواح", "الجوبة", "رحبة", "بدبدة", "حريب", "مجزر", "رغوان", "مدغل", "ماهلية", "جبل مراد"],
    "الجوف": ["الحزم", "الغيل", "المتون", "برط العنان", "المصلوب", "خب والشعف", "الزاهر"],
    "حجة": ["حجة", "ميدي", "عبس", "حيران", "كشر", "المحابشة", "أسلم", "الشغادرة", "وشحة", "أفلح اليمن", "أفلح الشام", "قفل شمر", "بني قيس", "نجرة", "كعيدنة", "مبين"],
    "ريمة": ["الجبين", "السلفية", "كسمة", "مزهر", "بلاد الطعام", "الجعفرية"],
    "المحويت": ["المحويت", "الطويلة", "الرجم", "حفاش", "ملحان", "بني سعد"],
    "عمران": ["عمران", "خمر", "قفلة عذر", "حوث", "حرف سفيان", "السودة", "عيال سريح", "ذيبين", "ثلاء", "مسور", "ريدة"],
    "صعدة": ["صعدة", "ساقين", "مجز", "منبه", "غمر", "قطابر", "رازح", "شدا", "باقم", "الظاهر", "حيدان", "سحار", "كتاف", "آل سالم"],
    "لحج": ["الحوطة", "تبن", "طور الباحة", "المقاطرة", "المسيمير", "القبيطة", "يافع", "المضاربة", "كرش"],
    "أبين": ["زنجبار", "خنفر", "جعار", "مودية", "الوضيع", "لودر", "المحفد", "سباح", "أحور"],
    "شبوة": ["عتق", "مرخة العليا", "مرخة السفلى", "نصاب", "حطيب", "رضوم", "ميفعة", "جردان", "عسيلان", "بيحان", "عين"],
    "حضرموت": ["المكلا", "الشحر", "غيل باوزير", "الديس", "بروم ميفع", "حجر", "يبعث", "الريدة وقصيعر", "دوعن", "حريضة", "سيئون", "تريم", "شبام", "القطن", "السوم", "ثمود", "رماه"],
    "المهرة": ["الغيضة", "سيحوت", "قشن", "حصوين", "المسيلة", "حوف", "منعر", "شحن", "حات"],
    "الضالع": ["الضالع", "دمت", "قعطبة", "الحصين", "الشعيب", "جحاف", "الأزارق", "جبن"],
    "سقطرى": ["حديبو", "قلنسية وعبد الكوري"]
};

// Initialize Location Dropdowns
document.addEventListener('DOMContentLoaded', function () {
    const govSelects = document.querySelectorAll('.governorate-select');
    govSelects.forEach(select => {
        // Clear previous options
        select.innerHTML = '<option value="" selected disabled>اختر المحافظة</option>';
        Object.keys(locationData).forEach(gov => {
            const option = document.createElement('option');
            option.value = gov;
            option.textContent = gov;
            select.appendChild(option);
        });

        // Add change listener
        select.addEventListener('change', function () {
            const distSelect = this.closest('.row').querySelector('.district-select');
            if (distSelect) {
                const districts = locationData[this.value] || [];
                distSelect.innerHTML = '<option value="" selected disabled>اختر المديرية</option>';
                districts.forEach(dist => {
                    const option = document.createElement('option');
                    option.value = dist;
                    option.textContent = dist;
                    distSelect.appendChild(option);
                });
            }
        });
    });
});
