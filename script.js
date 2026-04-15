function openTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));

    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName).classList.add('active');
    
    // Tìm button tương ứng để set active
    navButtons.forEach(btn => {
        if(btn.innerText.toLowerCase() === tabName.toLowerCase()) {
            btn.classList.add('active');
        }
    });
    
    // Cuộn lên đầu trang nội dung
    document.querySelector('.main-content').scrollTop = 0;
}

function openModal(modalId) { document.getElementById(modalId).style.display = 'block'; }
function closeModal(modalId) { document.getElementById(modalId).style.display = 'none'; }
window.onclick = function(event) { if (event.target.className === 'modal') { event.target.style.display = 'none'; } }
