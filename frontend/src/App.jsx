import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import useOrderBootstrap from './hooks/useOrderBootstrap';
import useOrderFlow from './hooks/useOrderFlow';
import useOrderSession from './hooks/useOrderSession';
import useProductCatalog from './hooks/useProductCatalog';
import useSeatSelection from './hooks/useSeatSelection';
import useMessageState from './hooks/useMessageState';
import CheckoutCompletePage from './pages/CheckoutCompletePage';
import OrderingPage from './pages/OrderingPage';
import StartPage from './pages/StartPage';

const SCREEN_PATHS = {
  start: '/',
  ordering: '/order',
  complete: '/complete',
};

export default function App({ config }) {
  const apiBaseUrl = config.apiBaseUrl ?? '/api/';
  const assetBaseUrl = config.assetBaseUrl ?? config.baseUrl ?? '/';
  const navigate = useNavigate();
  const location = useLocation();
  const messages = useMessageState();
  const session = useOrderSession(config);
  const seat = useSeatSelection({
    config,
    apiBaseUrl,
    setErrorMessage: messages.setErrorMessage,
  });
  const menu = useProductCatalog({
    apiBaseUrl,
    screen: session.screen,
    setErrorMessage: messages.setErrorMessage,
  });

  useOrderBootstrap({
    apiBaseUrl,
    session,
    setErrorMessage: messages.setErrorMessage,
  });

  const { handleStartOrder, handleAddOrder, handleBill, returnToTopScreen } = useOrderFlow({
    apiBaseUrl,
    seat,
    menu,
    session,
    messages,
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

  const actions = {
    handleStartOrder,
    handleAddOrder,
    handleBill,
    returnToTopScreen,
  };

  return (
    <Routes>
      <Route path="/" element={<StartPage seat={seat} session={session} messages={messages} actions={actions} />} />
      <Route path="/order" element={<OrderingPage assetBaseUrl={assetBaseUrl} seat={seat} menu={menu} session={session} messages={messages} actions={actions} />} />
      <Route path="/complete" element={<CheckoutCompletePage seat={seat} session={session} actions={actions} />} />
      <Route path="*" element={<Navigate to={SCREEN_PATHS[session.screen] ?? SCREEN_PATHS.start} replace />} />
    </Routes>
  );
}
