import MapView from '@/components/MapView';
import ErrorBanner from '@/components/ErrorBanner';
import AppRoutes from '@/routes/AppRoutes';
import { useApp } from '@/context/AppContext';

export default function App() {
  const { blur, results } = useApp();

  return (
    <div className="relative h-full w-full overflow-hidden">
      <MapView blur={blur} results={results} />
      <ErrorBanner />
      <div className="absolute inset-0 z-20">
        <AppRoutes />
      </div>
    </div>
  );
}
