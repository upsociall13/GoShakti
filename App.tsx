
import React, { useState } from 'react';
import Layout from './components/Layout';
import Landing from './views/Landing';
import FarmerProfile from './views/FarmerProfile';
import ProductProvenance from './views/ProductProvenance';
import AdminDashboard from './views/AdminDashboard';
import { UserRole } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [role, setRole] = useState<UserRole>(UserRole.PUBLIC);

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <Landing 
          onScanFarmer={() => setCurrentView('farmer-view')} 
          onScanProduct={() => setCurrentView('product-view')} 
          onLoginClick={() => {
            // Simulate navigation to a login-protected area
            if (role === UserRole.PUBLIC) {
              // Default to Officer for simulation if no role selected
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
          onScanFarmer={() => setCurrentView('farmer-view')} 
          onScanProduct={() => setCurrentView('product-view')} 
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
    >
      <div className="animate-in fade-in duration-500">
        {renderView()}
      </div>
    </Layout>
  );
};

export default App;
