import { useEffect, useMemo } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAppConfig } from './context/AppConfigContext';
import { MessagesProvider } from './context/MessagesContext';
import { SessionProvider } from './context/SessionContext';
import { SeatProvider } from './context/SeatContext';
import { ServicesProvider } from './context/ServicesContext';
import { createApiClient } from './services/api';
import { createCategoryService } from './services/categoryService';
import { createOrderService } from './services/orderService';
import { createOrderSessionService } from './services/orderSessionService';
import { createProductService } from './services/productService';
import { createSeatService } from './services/seatService';
import { createVisitService } from './services/visitService';
import useOrderBootstrap from './hooks/useOrderBootstrap';
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
  const apiBaseUrl = config.apiBaseUrl ?? '/api/';
  const apiClient = useMemo(() => createApiClient(apiBaseUrl), [apiBaseUrl]);
  const categoryService = useMemo(() => createCategoryService(apiClient), [apiClient]);
  const productService = useMemo(() => createProductService(apiClient), [apiClient]);
  const seatService = useMemo(() => createSeatService(apiClient), [apiClient]);
  const visitService = useMemo(() => createVisitService(apiClient), [apiClient]);
  const orderService = useMemo(() => createOrderService(apiClient), [apiClient]);
  const orderSessionService = useMemo(() => createOrderSessionService({ visitService, orderService }), [orderService, visitService]);
  const navigate = useNavigate();
  const location = useLocation();
  const messages = useMessageState();
  const session = useOrderSession(config);
  const seat = useSeatSelection({
    config,
    seatService,
    setErrorMessage: messages.setErrorMessage,
  });

  useOrderBootstrap({
    orderSessionService,
    session,
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

  const services = {
    categoryService,
    productService,
    orderService,
    orderSessionService,
  };

  return (
    <SessionProvider value={session}>
      <SeatProvider value={seat}>
        <MessagesProvider value={messages}>
          <ServicesProvider value={services}>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/order" element={<OrderingPage />} />
            <Route path="/complete" element={<CheckoutCompletePage />} />
            <Route path="*" element={<Navigate to={SCREEN_PATHS[session.screen] ?? SCREEN_PATHS.start} replace />} />
          </Routes>
          </ServicesProvider>
        </MessagesProvider>
      </SeatProvider>
    </SessionProvider>
  );
}
