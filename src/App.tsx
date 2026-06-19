import Stage from './components/Stage';
import Loader from './components/Loader';
import { useStore } from './state/store';

export default function App() {
  const view = useStore((s) => s.view);
  return (
    <>
      <Stage />
      {view === 'loader' && <Loader />}
    </>
  );
}
