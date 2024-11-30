import React from 'react'

import Navbar from './Components/Navbar/Navbar'
import Admin from './Pages/Admin/Admin'

// Phân tích URL để trích xuất tham số auth-token
function getAuthTokenFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('auth-token');
}

// Kiểm tra xem auth-token đã được truyền qua URL hay không
const authToken = getAuthTokenFromURL();
if (authToken) {
  // Lưu auth-token vào localStorage hoặc nơi lưu trữ khác
  localStorage.setItem('auth-token', authToken);
  // Sau khi xử lý auth-token, bạn có thể xoá tham số từ URL nếu cần
  window.history.replaceState({}, document.title, window.location.pathname);
}

function App() {
  return (
    <div>
      <Navbar />
      <Admin />
    </div>
  )
}

export default App