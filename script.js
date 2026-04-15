function openTab(tabName) {
    // 1. Ép ẩn tất cả các nội dung tab
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.style.display = 'none'; 
        tab.classList.remove('active');
    });

    // 2. Tắt trạng thái sáng (active) của tất cả các nút
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));

    // 3. Bật hiển thị tab được chọn
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.style.display = 'block';
        selectedTab.classList.add('active');
    }
    
    // 4. Làm sáng nút bấm tương ứng
    navButtons.forEach(btn => {
        // So sánh tên nút với tên tab (bỏ qua khoảng trắng và viết hoa/thường)
        if(btn.innerText.trim().toLowerCase() === tabName.toLowerCase()) {
            btn.classList.add('active');
        }
    });
    
    // 5. Tự động cuộn lên đầu trang cho đẹp mắt
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.scrollTop = 0;
    }
}

// Chức năng mở/đóng Project Modal
function openModal(modalId) { 
    document.getElementById(modalId).style.display = 'block'; 
}

function closeModal(modalId) { 
    document.getElementById(modalId).style.display = 'none'; 
}

// Bấm ra ngoài khoảng đen để tự đóng Project
window.onclick = function(event) { 
    if (event.target.className === 'modal') { 
        event.target.style.display = 'none'; 
    } 
}

// Thiết lập mặc định khi vừa tải trang xong (Mở sẵn trang Overview)
window.onload = function() {
    openTab('overview');
}
