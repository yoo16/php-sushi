import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAppConfig } from './context/AppConfigContext';
import { MessagesProvider } from './context/MessagesContext';
import { SessionProvider } from './context/SessionContext';
import { SeatProvider } from './context/SeatContext';
import useSeatSelection from './hooks/useSeatSelection';
import useOrderSession from './hooks/useOrderSession';
import useMessageState from './hooks/useMessageState';
import CheckoutCompletePage from './pages/CheckoutCompletePage';
import OrderingPage from './pages/OrderingPage';
import StartPage from './pages/StartPage';

const SCREEN_PATHS = {
  start: '/',
  ordering: '/order',
  complete: '/complete',
};

export default function App() {
  const config = useAppConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const messages = useMessageState();
  const session = useOrderSession(config, {
    setErrorMessage: messages.setErrorMessage,
  });
  const seat = useSeatSelection({
    config,
    setErrorMessage: messages.setErrorMessage,
  });

  useEffect(() => {
    const nextPath = SCREEN_PATHS[session.screen] ?? SCREEN_PATHS.start;

    if (location.pathname !== nextPath) {
      navigate(nextPath, { replace: true });
    }
  }, [location.pathname, navigate, session.screen]);

  if (session.isBooting) {
    return null;
  }

  return (
    <AppProviders session={session} seat={seat} messages={messages}>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/order" element={<OrderingPage />} />
        <Route path="/complete" element={<CheckoutCompletePage />} />
        <Route path="*" element={<Navigate to={SCREEN_PATHS[session.screen] ?? SCREEN_PATHS.start} replace />} />
      </Routes>
    </AppProviders>
  );
}

function AppProviders({ session, seat, messages, children }) {
  return (
    <SessionProvider value={session}>
      <SeatProvider value={seat}>
        <MessagesProvider value={messages}>
          {children}
        </MessagesProvider>
      </SeatProvider>
    </SessionProvider>
  );
}
