import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

function CompteForm({ compteToEdit, onSuccess, onCancel }) {
  // Initialisation de l'état pour stocker les données du formulaire
  const [compte, setCompte] = useState({
    solde: '',
    dateCreation: '',
    type: 'COURANT'
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Mettre à jour le formulaire quand un compte est sélectionné pour édition
  useEffect(() => {
    if (compteToEdit) {
      setIsEditMode(true);
      setCompte({
        solde: compteToEdit.solde,
        dateCreation: compteToEdit.dateCreation ? formatDateForInput(compteToEdit.dateCreation) : '',
        type: compteToEdit.type || 'COURANT'
      });
    } else {
      resetForm();
    }
  }, [compteToEdit]);

  // Formater la date pour l'input (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompte({ ...compte, [name]: value });
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setCompte({ solde: '', dateCreation: '', type: 'COURANT' });
    setIsEditMode(false);
  };

  // Validation du formulaire
  const validateForm = () => {
    if (!compte.solde || compte.solde === '') {
      alert('⚠️ Veuillez entrer un solde');
      return false;
    }
    if (parseFloat(compte.solde) < 0) {
      alert('⚠️ Le solde ne peut pas être négatif');
      return false;
    }
    if (!compte.dateCreation) {
      alert('⚠️ Veuillez sélectionner une date de création');
      return false;
    }
    if (!compte.type) {
      alert('⚠️ Veuillez sélectionner un type de compte');
      return false;
    }
    return true;
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    const compteData = {
      ...compte,
      solde: parseFloat(compte.solde)
    };

    if (isEditMode && compteToEdit) {
      // Mode UPDATE
      axios.put(`${API_BASE_URL}/comptes/${compteToEdit.id}`, compteData)
        .then(() => {
          alert('Compte modifié avec succès ✅');
          resetForm();
          onSuccess();
        })
        .catch(error => {
          console.error('Erreur lors de la modification:', error);
          alert('❌ Erreur lors de la modification du compte');
        })
        .finally(() => setSubmitting(false));
    } else {
      // Mode CREATE
      axios.post(`${API_BASE_URL}/comptes`, compteData)
        .then(() => {
          alert('Compte ajouté avec succès ✅');
          resetForm();
          onSuccess();
        })
        .catch(error => {
          console.error('Erreur lors de la création:', error);
          alert('❌ Erreur lors de la création du compte');
        })
        .finally(() => setSubmitting(false));
    }
  };

  const handleCancelEdit = () => {
    resetForm();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">
            {isEditMode ? '✏️ Modifier un Compte' : '➕ Ajouter un Compte'}
          </h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Solde (MAD)</label>
              <input
                type="number"
                name="solde"
                className="form-control"
                value={compte.solde}
                onChange={handleChange}
                placeholder="Ex: 5000"
                step="0.01"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Date de Création</label>
              <input
                type="date"
                name="dateCreation"
                className="form-control"
                value={compte.dateCreation}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Type de Compte</label>
              <select
                name="type"
                className="form-select"
                value={compte.type}
                onChange={handleChange}
                required
              >
                <option value="COURANT">💳 Courant</option>
                <option value="EPARGNE">💰 Épargne</option>
              </select>
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className={`btn ${isEditMode ? 'btn-warning' : 'btn-primary'}`}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    En cours...
                  </>
                ) : (
                  isEditMode ? '✏️ Modifier' : '➕ Ajouter'
                )}
              </button>

              {isEditMode && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                  disabled={submitting}
                >
                  ❌ Annuler
                </button>
              )}

              {!isEditMode && compte.solde && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  🔄 Réinitialiser
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CompteForm;