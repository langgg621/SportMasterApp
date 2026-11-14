import { useEffect, useState } from 'react';

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const calc = (endsAt?: string | number | Date | null) => {
  const end = endsAt ? new Date(endsAt).getTime() : 0;
  const diff = Math.max(0, Math.floor((end - Date.now()) / 1000));
  return {
    hours: pad(Math.floor(diff / 3600)),
    minutes: pad(Math.floor((diff % 3600) / 60)),
    seconds: pad(diff % 60),
  };
};

/** Đếm ngược tới thời điểm `endsAt` lấy từ DB (không tự suy ra "hết ngày" nữa). Không có endsAt -> 00:00:00 */
export function useCountdown(endsAt?: string | number | Date | null) {
  const [time, setTime] = useState(() => calc(endsAt));
  useEffect(() => {
    setTime(calc(endsAt));
    const id = setInterval(() => setTime(calc(endsAt)), 1000);
    return () => clearInterval(id);
  }, [endsAt]);
  return time;
}
