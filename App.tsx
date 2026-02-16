
import React, { useState } from 'react';
import Layout from './components/Layout';
import Landing from './views/Landing';
import FarmerProfile from './views/FarmerProfile';
import ProductProvenance from './views/ProductProvenance';
import AdminDashboard from './views/AdminDashboard';
import QRScanner from './components/QRScanner';
import { UserRole } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [role, setRole] = useState<UserRole>(UserRole.PUBLIC);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleScanResult = (type: 'FARMER' | 'PRODUCT', id: string) => {
    setIsScannerOpen(false);
    if (type === 'FARMER') {
      setCurrentView('farmer-view');
    } else {
      setCurrentView('product-view');
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <Landing 
          onScanFarmer={() => setIsScannerOpen(true)} 
          onScanProduct={() => setIsScannerOpen(true)} 
          onLoginClick={() => {
            if (role === UserRole.PUBLIC) {
              setRole(UserRole.GOVT_OFFICER);
            }
            setCurrentView('admin');
          }}
        />;
      case 'farmer-view':
        return <FarmerProfile />;
      case 'product-view':
        return <ProductProvenance />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Landing 
          onScanFarmer={() => setIsScannerOpen(true)} 
          onScanProduct={() => setIsScannerOpen(true)} 
          onLoginClick={() => setCurrentView('admin')}
        />;
    }
  };

  return (
    <Layout 
      role={role} 
      setRole={(newRole) => {
        setRole(newRole);
        if (newRole === UserRole.GOVT_OFFICER || newRole === UserRole.AUDITOR) {
          setCurrentView('admin');
        } else if (newRole === UserRole.FARMER) {
          setCurrentView('farmer-view');
        } else {
          setCurrentView('landing');
        }
      }}
      onNavigate={setCurrentView}
      onOpenScanner={() => setIsScannerOpen(true)}
    >
      <div className="animate-in fade-in duration-500">
        {renderView()}
      </div>

      {isScannerOpen && (
        <QRScanner 
          onClose={() => setIsScannerOpen(false)} 
          onResult={handleScanResult} 
        />
      )}
    </Layout>
  );
};

export default App;
