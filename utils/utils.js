// 导出格式化磁盘大小的函数,输入单位M
export const formatDiskSize = (size) => {
  if (!size) return null;
  return size > 1024 ? `${(size / 1024).toFixed(2)} G` : `${size} M`;
};

// 导出格式化磁盘大小的函数，输入单位字节
export const formatDiskSizeFromBytes = (bytes) => {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
};

// throttle 下载进度节流函数
export function throttle(func, wait) {
  let timeout = null;
  let lastCall = 0;

  return function(...args) {
    const now = new Date().getTime();
    const remaining = wait - (now - lastCall);
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastCall = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        lastCall = new Date().getTime();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}

