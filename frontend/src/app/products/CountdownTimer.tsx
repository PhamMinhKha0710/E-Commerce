//CountdownTimer.tsx
"use client";
import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="timer-view" data-countdown="countdown" data-date={targetDate}>
      <div className="block-timer">
        <p>{timeLeft.days.toString().padStart(2, '0')}</p>
      </div>
      <span>:</span>
      <div className="block-timer">
        <p>{timeLeft.hours.toString().padStart(2, '0')}</p>
      </div>
      <span className="mobile">:</span>
      <div className="block-timer">
        <p>{timeLeft.minutes.toString().padStart(2, '0')}</p>
      </div>
      <span>:</span>
      <div className="block-timer">
        <p>{timeLeft.seconds.toString().padStart(2, '0')}</p>
      </div>
    </div>
  );
};

export default CountdownTimer;