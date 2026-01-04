import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

function CompteList({ refreshTrigger, onEdit }) {
  const [comptes, setComptes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour charger les comptes
  const loadComptes = () => {
    setLoading(true);
    setError(null);
    axios.get(`${API_BASE_URL}/comptes`)
      .then(response => {
        setComptes(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors du chargement:', error);
        setError('Erreur lors du chargement des comptes. Assurez-vous que le serveur backend est démarré.');
        setLoading(false);
      });
  };

  // Charger les comptes au montage et quand refreshTrigger change
  useEffect(() => {
    loadComptes();
  }, [refreshTrigger]);

  // Fonction pour supprimer un compte
  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      axios.delete(`${API_BASE_URL}/comptes/${id}`)
        .then(() => {
          alert('Compte supprimé avec succès ✅');
          loadComptes(); // Recharger la liste
        })
        .catch(error => {
          console.error('Erreur lors de la suppression:', error);
          alert('❌ Erreur lors de la suppression du compte');
        });
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Formater le solde
  const formatSolde = (solde) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD'
    }).format(solde);
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-primary" onClick={loadComptes}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>📋 Liste des Comptes</h2>
        <button className="btn btn-outline-primary" onClick={loadComptes}>
          🔄 Actualiser
        </button>
      </div>

      {comptes.length === 0 ? (
        <div className="alert alert-info">
          Aucun compte trouvé. Créez-en un nouveau ci-dessus.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Solde</th>
                <th>Date de Création</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {comptes.map(compte => (
                <tr key={compte.id}>
                  <td>{compte.id}</td>
                  <td className="fw-bold">{formatSolde(compte.solde)}</td>
                  <td>{formatDate(compte.dateCreation)}</td>
                  <td>
                    <span className={`badge ${compte.type === 'EPARGNE' ? 'bg-success' : 'bg-primary'}`}>
                      {compte.type}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => onEdit(compte)}
                      title="Modifier"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(compte.id)}
                      title="Supprimer"
                    >
                      🗑️ Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3 text-muted">
        Total: {comptes.length} compte{comptes.length > 1 ? 's' : ''}
      </div>
    </div>
  );
}

export default CompteList;