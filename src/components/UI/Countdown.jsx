import React, { useEffect, useMemo, useState } from "react";

const getExpiryTime = (value) => {
  const numericValue = Number(value);

  if (Number.isFinite(numericValue)) {
    return numericValue;
  }

  return new Date(value).getTime();
};

const getRemainingTime = (expiryTime) => {
  if (!Number.isFinite(expiryTime)) {
    return 0;
  }

  return Math.max(expiryTime - Date.now(), 0);
};

const Countdown = ({ expiryDate }) => {
  const expiryTime = useMemo(() => getExpiryTime(expiryDate), [expiryDate]);
  const [remaining, setRemaining] = useState(() =>
    getRemainingTime(expiryTime)
  );

  useEffect(() => {
    setRemaining(getRemainingTime(expiryTime));

    const interval = setInterval(() => {
      setRemaining(getRemainingTime(expiryTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime]);

  if (!Number.isFinite(expiryTime)) {
    return null;
  }

  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return (
    <span>
      {hours}h {minutes}m {seconds}s
    </span>
  );
};

export default Countdown;