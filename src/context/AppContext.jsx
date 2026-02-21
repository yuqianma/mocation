import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { fetchPoints } from '@/services/fetchPoints';
import { login } from '@/services/login';

const NOW = dayjs().add(1, 'hour').startOf('hour');
const DEFAULT_RANGE = [NOW.subtract(1, 'day'), NOW];

function getInitialUser() {
  try {
    const localUserString = window.localStorage.getItem('user');
    if (!localUserString) {
      return { name: null, sessionToken: null };
    }

    const parsed = JSON.parse(localUserString);
    return {
      name: parsed?.name || null,
      sessionToken: parsed?.sessionToken || null,
    };
  } catch {
    return { name: null, sessionToken: null };
  }
}

function normalizeDateRange(range) {
  const safe = Array.isArray(range) ? range.filter(Boolean).slice(0, 2) : [];
  if (safe.length === 0) {
    return DEFAULT_RANGE.map((date) => date.format('YYYY-MM-DD'));
  }
  if (safe.length === 1) {
    return [safe[0], safe[0]];
  }
  return safe.sort();
}

function padTimeUnit(value) {
  return String(value).padStart(2, '0');
}

function normalizeTime(value, fallback) {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    const match = trimmed.match(/^(\d{1,2}):(\d{1,2})$/);
    if (match) {
      const hour = Number(match[1]);
      const minute = Number(match[2]);
      if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
        return `${padTimeUnit(hour)}:${padTimeUnit(minute)}`;
      }
    }

    const asNumber = Number(trimmed);
    if (Number.isFinite(asNumber)) {
      const clamped = Math.max(0, Math.min(23, Math.floor(asNumber)));
      return `${padTimeUnit(clamped)}:00`;
    }
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const clamped = Math.max(0, Math.min(23, Math.floor(value)));
    return `${padTimeUnit(clamped)}:00`;
  }

  return fallback;
}

function toIsoRange(dateRange, timeFrom, timeTo) {
  const [fromDate, toDate] = normalizeDateRange(dateRange);
  const defaultFrom = DEFAULT_RANGE[0].format('HH:mm');
  const defaultTo = DEFAULT_RANGE[1].format('HH:mm');
  const safeTimeFrom = normalizeTime(timeFrom, defaultFrom);
  const safeTimeTo = normalizeTime(timeTo, defaultTo);
  const from = dayjs(`${fromDate}T${safeTimeFrom}`);
  const to = dayjs(`${toDate}T${safeTimeTo}`);

  const safeFrom = from.isValid() ? from : DEFAULT_RANGE[0];
  const safeTo = to.isValid() ? to : DEFAULT_RANGE[1];

  if (safeFrom.isAfter(safeTo)) {
    return [safeTo.toISOString(), safeFrom.toISOString()];
  }

  return [safeFrom.toISOString(), safeTo.toISOString()];
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);
  const [blur, setBlur] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [dateRange, setDateRange] = useState(DEFAULT_RANGE.map((date) => date.format('YYYY-MM-DD')));
  const [timeFrom, setTimeFrom] = useState(DEFAULT_RANGE[0].format('HH:mm'));
  const [timeTo, setTimeTo] = useState(DEFAULT_RANGE[1].format('HH:mm'));
  const [results, setResults] = useState([]);
  const [picking, setPicking] = useState(false);
  const [isFetchingPoints, setIsFetchingPoints] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [selectedPointTimestamp, setSelectedPointTimestamp] = useState('');

  const range = useMemo(() => toIsoRange(dateRange, timeFrom, timeTo), [dateRange, timeFrom, timeTo]);

  const persistUser = useCallback((nextUser) => {
    setUser(nextUser);
    window.localStorage.setItem('user', JSON.stringify(nextUser));
  }, []);

  const clearError = useCallback(() => {
    setErrorMsg('');
  }, []);

  const setDateRangeValue = useCallback((nextRange) => {
    setDateRange(normalizeDateRange(nextRange));
  }, []);

  const setTimeFromValue = useCallback((nextTime) => {
    setTimeFrom((current) => normalizeTime(nextTime, current));
  }, []);

  const setTimeToValue = useCallback((nextTime) => {
    setTimeTo((current) => normalizeTime(nextTime, current));
  }, []);

  const showPicker = useCallback(() => {
    setPicking(true);
    setBlur(true);
  }, []);

  const hidePicker = useCallback(() => {
    setPicking(false);
    setBlur(false);
  }, []);

  const loginUser = useCallback(
    async ({ name, password }) => {
      setIsLoggingIn(true);
      try {
        const response = await login({ username: name, password });
        const nextUser = {
          name: response.username,
          sessionToken: response.sessionToken,
        };
        persistUser(nextUser);
        return nextUser;
      } catch (error) {
        setErrorMsg(error);
        throw error;
      } finally {
        setIsLoggingIn(false);
      }
    },
    [persistUser]
  );

  const logoutUser = useCallback(() => {
    persistUser({ name: null, sessionToken: null });
    setResults([]);
    setSelectedPointTimestamp('');
    hidePicker();
  }, [hidePicker, persistUser]);

  const fetchPointsForCurrentRange = useCallback(async () => {
    if (!user.sessionToken) {
      return [];
    }

    setIsFetchingPoints(true);
    try {
      const points = await fetchPoints(range[0], range[1], user.sessionToken);
      setResults(points);
      setSelectedPointTimestamp('');
      return points;
    } catch (error) {
      setErrorMsg(error);
      throw error;
    } finally {
      setIsFetchingPoints(false);
    }
  }, [range, user.sessionToken]);

  const value = useMemo(
    () => ({
      user,
      blur,
      setBlur,
      errorMsg,
      setErrorMsg,
      clearError,
      dateRange,
      setDateRange: setDateRangeValue,
      timeFrom,
      setTimeFrom: setTimeFromValue,
      timeTo,
      setTimeTo: setTimeToValue,
      results,
      selectedPointTimestamp,
      setSelectedPointTimestamp,
      picking,
      showPicker,
      hidePicker,
      isFetchingPoints,
      isLoggingIn,
      range,
      loginUser,
      logoutUser,
      fetchPointsForCurrentRange,
    }),
    [
      blur,
      clearError,
      dateRange,
      errorMsg,
      fetchPointsForCurrentRange,
      hidePicker,
      isFetchingPoints,
      isLoggingIn,
      loginUser,
      logoutUser,
      picking,
      range,
      results,
      selectedPointTimestamp,
      setDateRangeValue,
      setTimeFromValue,
      setTimeToValue,
      timeFrom,
      timeTo,
      user,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
