import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MainLayout } from './layouts';
import { SplashScreen } from './components';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <MainLayout />
      <SplashScreen isVisible={showSplash} />
    </BrowserRouter>
  );
}

export default App;