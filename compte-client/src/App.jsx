import React, { useState } from 'react';
import CompteList from './components/CompteList';
import CompteForm from './components/CompteForm';
import './App.css';

function App() {
  const [compteToEdit, setCompteToEdit] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Callback appelé après une création ou modification réussie
  const handleSuccess = () => {
    setCompteToEdit(null);
    setRefreshTrigger(prev => prev + 1); // Déclenche un rechargement de la liste
  };

  // Callback pour éditer un compte
  const handleEdit = (compte) => {
    setCompteToEdit(compte);
    // Scroll vers le formulaire
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Callback pour annuler l'édition
  const handleCancelEdit = () => {
    setCompteToEdit(null);
  };

  return (
    <div className="app-container">
      <header className="app-header bg-primary text-white py-4 mb-4 shadow">
        <div className="container">
          <h1 className="mb-0">🏦 Gestion Bancaire</h1>
          <p className="mb-0 mt-2">Système de gestion des comptes bancaires</p>
        </div>
      </header>

      <main>
        <CompteForm
          compteToEdit={compteToEdit}
          onSuccess={handleSuccess}
          onCancel={handleCancelEdit}
        />

        <hr className="my-5" />

        <CompteList
          refreshTrigger={refreshTrigger}
          onEdit={handleEdit}
        />
      </main>

      <footer className="app-footer text-center text-muted py-4 mt-5">
        <div className="container">
          <p className="mb-0">© 2025 - Système de Gestion Bancaire</p>
        </div>
      </footer>
    </div>
  );
}

export default App;