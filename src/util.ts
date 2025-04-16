
export function showToast(message, duration = 2000, error = false) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  if (error) {

    toast.classList.add('toastError')
  } else {
    toast.classList.remove('toastError')
  }
  // error ? toast.classList.add('toastError') : toast.classList.remove('toastError')
  setTimeout(() => toast.classList.remove('show'), duration);
}