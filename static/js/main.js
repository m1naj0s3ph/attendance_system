// إدارة الشريط الجانبي
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');

    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('sidebar-open');
    });

    // إغلاق الشريط الجانبي عند النقر خارجها
    document.addEventListener('click', function(event) {
        if (!sidebar.contains(event.target) && !menuToggle.contains(event.target) && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            mainContent.classList.remove('sidebar-open');
        }
    });

    // منع إغلاق الشريط الجانبي عند النقر داخلها
    sidebar.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // إدارة الماسح الضوئي
    const startScannerBtn = document.getElementById('start-scanner');
    const stopScannerBtn = document.getElementById('stop-scanner');
    const qrScanner = document.getElementById('qr-scanner');
    const barcodeInput = document.getElementById('barcode-input');
    const studentIdInput = document.getElementById('student_id_input');

    if (startScannerBtn) {
        startScannerBtn.addEventListener('click', function() {
            qrScanner.style.display = 'block';
            startQRScanner();
        });
    }

    if (stopScannerBtn) {
        stopScannerBtn.addEventListener('click', function() {
            qrScanner.style.display = 'none';
            stopQRScanner();
        });
    }

    // إدخال الباركود الخارجي
    if (barcodeInput && studentIdInput) {
        barcodeInput.addEventListener('input', function() {
            if (this.value.length > 0) {
                studentIdInput.value = this.value;
                this.value = '';
                
                // إرسال النموذج تلقائياً
                document.getElementById('scan-form').submit();
            }
        });

        barcodeInput.focus();
    }

    // التركيز على حقل إدخال ID
    if (studentIdInput) {
        studentIdInput.focus();
    }
});

// إدارة الماسح الضوئي للكاميرا
let videoStream = null;
let scanning = false;

function startQRScanner() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const outputMessage = document.getElementById('outputMessage');
    const studentIdInput = document.getElementById('student_id_input');

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(function(stream) {
            videoStream = stream;
            video.srcObject = stream;
            video.play();
            scanning = true;
            scanQRCode();
        })
        .catch(function(err) {
            console.error("خطأ في الوصول للكاميرا: ", err);
            outputMessage.innerHTML = '<div class="alert alert-danger">❌ لا يمكن الوصول للكاميرا. تأكد من السماح باستخدام الكاميرا.</div>';
        });

    function scanQRCode() {
        if (!scanning) return;

        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            
            if (code) {
                outputMessage.innerHTML = '<div class="alert alert-success">✅ تم مسح الكود بنجاح: ' + code.data + '</div>';
                studentIdInput.value = code.data;
                
                // إرسال النموذج تلقائياً بعد تأخير بسيط
                setTimeout(function() {
                    document.getElementById('scan-form').submit();
                }, 1000);
                
                stopQRScanner();
                return;
            }
        } catch (e) {
            console.error("خطأ في مسح الكود: ", e);
        }

        requestAnimationFrame(scanQRCode);
    }
}

function stopQRScanner() {
    scanning = false;
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
    const video = document.getElementById('video');
    if (video) {
        video.srcObject = null;
    }
}

// إدارة النماذج الديناميكية
function addClassField() {
    const container = document.getElementById('classes-container');
    const newClass = container.firstElementChild.cloneNode(true);
    
    newClass.querySelector('.remove-class').style.display = 'block';
    newClass.querySelectorAll('select, input').forEach(element => {
        element.value = '';
    });
    
    container.appendChild(newClass);
}

function removeClassField(button) {
    if (document.querySelectorAll('.class-entry').length > 1) {
        button.closest('.class-entry').remove();
    }
}

// التحقق من النماذج
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            field.style.borderColor = '#27ae60';
        }
    });

    if (!isValid) {
        alert('يرجى ملء جميع الحقول المطلوبة');
    }

    return isValid;
}

// إدارة التنبيهات
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} fade-in`;
    alertDiv.innerHTML = message;
    
    document.body.insertBefore(alertDiv, document.body.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// تحميل الصفحة بسلاسة
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});