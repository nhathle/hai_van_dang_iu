document.addEventListener('DOMContentLoaded', () => {
    const initialScreen = document.getElementById('initial-screen');
    const scanButton = document.getElementById('scan-button');
    const confessionScreen = document.getElementById('confession-screen');
    const subtitleContainer = document.getElementById('subtitle-container');
    const subtitleTextElement = document.getElementById('subtitle-text');
    const backgroundMusic = document.getElementById('background-music'); // THÊM DÒNG NÀY


    const phrases = [
        "Em bé Hải Vân xinh ngoan iu",
        "Tiểu mặt trời mê hải cá bé bỏng",
        "Hoạt bát đáng iuuu ♡",
        "Rực rỡ tỏa sáng ♡",
        "Môi đỏ má hồng", // Lời thoại từ video
        "Tim anh rung động vì nàng ♡"
    ];

    const hearts = ["❤️", "💖", "💕", "💗"]; // Các loại trái tim khác nhau

    // Lời thoại / Lời bài hát lớn xuất hiện tuần tự
    const subtitles = [
        { text: "Gửi đến Hải Vân thân thương ❤️", duration: 3000 },
        { text: "Em hãy cười nhiều lên nhé!", duration: 3500 },
        { text: "Năng lượng em mang đến tâm hồn anh", duration: 4300 },
        { text: "Siêu ấm áp, làm lòng anh tan chảy", duration: 5000 },
        { text: "Anh thích em nhiều!!!", duration: 5000 },
    ];
    let currentSubtitleIndex = 0;
    let textInterval, heartInterval, subtitleTimeout;

    function getRandomPosition(element) {
        const x = Math.random() * (confessionScreen.offsetWidth - element.offsetWidth - 20) + 10; // 10px padding
        const y = Math.random() * (confessionScreen.offsetHeight - element.offsetHeight - 20) + 10;
        return { x, y };
    }

    function createFloatingElement(content, typeClass) {
        const element = document.createElement('div');
        element.classList.add(typeClass);
        element.innerHTML = content;

        // Đặt vị trí ban đầu trước khi lấy kích thước
        element.style.left = '-9999px'; // Tạm thời đặt ra ngoài màn hình để lấy kích thước chính xác
        element.style.top = '-9999px';
        confessionScreen.appendChild(element);
        
        const { x, y } = getRandomPosition(element);
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;

        // Thời gian animation ngẫu nhiên để không đồng bộ
        const duration = Math.random() * 3 + 4; // Từ 4 đến 7 giây
        element.style.animationDuration = `${duration}s`;
        
        // Ngẫu nhiên độ trễ animation
        const delay = Math.random() * 2; // Trễ tối đa 2 giây
        element.style.animationDelay = `${delay}s`;

        // Xóa phần tử sau khi animation kết thúc để tránh đầy DOM
        element.addEventListener('animationend', () => {
            element.remove();
        });
    }

    function startGeneratingElements() {
        // Tạo chữ
        textInterval = setInterval(() => {
            const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
            createFloatingElement(randomPhrase, 'floating-text');
        }, 800); // Tạo chữ mới mỗi 0.8 giây

        // Tạo trái tim
        heartInterval = setInterval(() => {
            const randomHeart = hearts[Math.floor(Math.random() * hearts.length)];
            createFloatingElement(randomHeart, 'floating-heart');
        }, 400); // Tạo tim mới mỗi 0.4 giây
    }

    function stopGeneratingElements() {
        clearInterval(textInterval);
        clearInterval(heartInterval);
        if (subtitleTimeout) clearTimeout(subtitleTimeout);
    }

    function showNextSubtitle() {
        if (currentSubtitleIndex < subtitles.length) {
            const current = subtitles[currentSubtitleIndex];
            subtitleTextElement.textContent = current.text;
            subtitleTextElement.style.opacity = '1'; // Hiện subtitle

            // Ẩn subtitle sau một khoảng thời gian
            subtitleTimeout = setTimeout(() => {
                subtitleTextElement.style.opacity = '0';
                // Sau khi ẩn, chờ một chút rồi hiện subtitle tiếp theo
                setTimeout(() => {
                    currentSubtitleIndex++;
                    showNextSubtitle();
                }, 500); // Chờ 0.5s trước khi đổi subtitle
            }, current.duration - 500); // Trừ 0.5s để có thời gian mờ dần

        } else {
            // Kết thúc subtitles, có thể làm gì đó ở đây, ví dụ dừng hiệu ứng hoặc lặp lại
            console.log("Hết lời thoại/bài hát.");
            // stopGeneratingElements(); // Ví dụ: dừng tạo phần tử mới
        }
    }

    function startConfession() {
        initialScreen.classList.add('hidden'); // Ẩn màn hình ban đầu
        confessionScreen.classList.remove('hidden'); // Hiện màn hình tỏ tình
        subtitleContainer.classList.remove('hidden'); // Hiện khung chứa subtitle

    // Phát nhạc nền
    if (backgroundMusic) {
        // Tải lại nhạc để đảm bảo phát từ đầu nếu đã từng phát trước đó
        backgroundMusic.load(); // Không bắt buộc nếu bạn luôn muốn nó tiếp tục từ điểm dừng
        backgroundMusic.play().catch(error => {
            console.warn("Không thể tự động phát nhạc. Trình duyệt có thể yêu cầu tương tác người dùng trước.", error);
            // Bạn có thể thông báo cho người dùng hoặc cung cấp một nút để họ tự bật nhạc
        });
    }

        startGeneratingElements();
        showNextSubtitle(); // Bắt đầu hiển thị chuỗi lời thoại
    }

    scanButton.addEventListener('click', startConfession);

    // Để dễ debug, có thể tự động bắt đầu sau 1 giây nếu không muốn click
    // setTimeout(startConfession, 1000);

    // Dọn dẹp khi trang bị đóng hoặc chuyển hướng (tùy chọn)
    // window.addEventListener('beforeunload', stopGeneratingElements);
});