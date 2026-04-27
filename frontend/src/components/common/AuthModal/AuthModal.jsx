import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../context/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../../constants/routes';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AuthModal.module.css';

import ImgLogin from '../../../assets/images/IMG-LOGIN.jpg';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, login, authModalTab } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState('connexion'); // 'connexion' | 'inscription'
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [tempGoogleUser, setTempGoogleUser] = useState(null);

  useEffect(() => {
    if (authModalTab) {
      setTab(authModalTab);
    }
  }, [authModalTab, isAuthModalOpen]);

  // Forms states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  
  // Handlers
  const handleClose = () => {
    closeAuthModal();
    setTab('connexion');
    setIsRoleModalOpen(false);
  };

  useEffect(() => {
    const onEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    if (isAuthModalOpen) {
      document.addEventListener('keydown', onEscape);
    }
    return () => {
      document.removeEventListener('keydown', onEscape);
    };
  }, [isAuthModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = tab === 'connexion' ? '/api/auth/login' : '/api/auth/register';
      const body = tab === 'connexion' 
        ? { email, password }
        : { name, email, password, phone };

      if (tab === 'inscription' && password !== confirmPassword) {
        alert("Les mots de passe ne correspondent pas");
        return;
      }

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (data.success) {
        if (tab === 'connexion') {
          login(data.user, data.token);
          handleClose();
          if (data.user.currentRole === 'PROPRIETAIRE') {
            navigate('/dashboard-proprietaire');
          } else if (data.user.currentRole === 'CLIENT') {
            navigate('/dashboard-client');
          }
        } else {
          alert('Inscription réussie! Veuillez vérifier votre email.');
          setTab('connexion');
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleLogin = () => {
    // Simulating Google Login Response
    const mockUser = {
      isNewUser: true, // Example flag to trigger role selection
      email: 'test@gmail.com',
      name: 'Google User',
    };
    
    if (mockUser.isNewUser) {
      setTempGoogleUser(mockUser);
      setIsRoleModalOpen(true);
    } else {
      // Direct login
      // login(user, token)
      handleClose();
    }
  };

  const selectRole = async (role) => {
    // We would eventually call API to save the Google user with role or update it
    console.log("Selected role:", role);
    // login(...)
    setIsRoleModalOpen(false);
    handleClose();
    if (role === 'PROPRIETAIRE') {
      navigate('/dashboard-proprietaire');
    } else {
      navigate('/dashboard-client');
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div 
          className={styles.modalBackdrop} 
          onClick={handleClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className={styles.modalContent} 
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            
            {!isRoleModalOpen ? (
              <>
                {/* LEFT SIDE : IMAGE */}
            <div className={styles.leftSide} style={{ backgroundImage: `url(${ImgLogin})` }}>
              <div className={styles.imageOverlay}></div>
              <div className={styles.leftContent}>
                <h2 className={styles.title}>Trouvez votre<br/>maison de rêve</h2>
                <p className={styles.subtitle}>
                  La première plateforme de location de maisons en Tunisie. Commencez votre aventure dès aujourd'hui.
                </p>
                <div className={styles.stats}>
                  <div className={styles.statItem}>
                    <span>📍</span> Plus de 500 propriétés en Tunisie
                  </div>
                  <div className={styles.statItem}>
                    <span>⭐</span> Note moyenne de 4.8/5 par nos clients
                  </div>
                  <div className={styles.statItem}>
                    <span>🛡️</span> Paiements 100% sécurisés
                  </div>
                </div>

                <div className={styles.statCards}>
                  <div className={styles.statCard}><h3>2.5K+</h3><p>Clients satisfaits</p></div>
                  <div className={styles.statCard}><h3>500+</h3><p>Propriétés</p></div>
                  <div className={styles.statCard}><h3>4.8</h3><p>Note moyenne</p></div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE : FORM */}
            <div className={styles.rightSide}>
              <div className={styles.tabs}>
                {['connexion', 'inscription'].map((t) => (
                  <button
                    key={t}
                    className={`${styles.tab} ${tab === t ? styles.activeTabRef : ''}`}
                    onClick={() => setTab(t)}
                  >
                    {t === 'connexion' ? 'Connexion' : 'Inscription'}
                    {tab === t && (
                      <motion.div
                        layoutId="activeTab"
                        className={styles.activeTabIndicator}
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <motion.div 
                className={styles.formContainer}
                key={tab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h2>{tab === 'connexion' ? 'Bon retour !' : 'Bienvenue !'}</h2>
                <p>{tab === 'connexion' ? 'Connectez-vous pour accéder à votre compte' : 'Créez votre compte pour commencer'}</p>

                <form onSubmit={handleSubmit}>
                  {tab === 'inscription' && (
                    <div className={styles.inputGroup}>
                      <label>Nom complet</label>
                      <input type="text" placeholder="Votre nom complet" value={name} onChange={(e)=>setName(e.target.value)} required />
                    </div>
                  )}

                  <div className={styles.inputGroup}>
                    <label>Adresse email</label>
                    <input type="email" placeholder="exemple@email.com" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                  </div>

                  {tab === 'inscription' && (
                    <div className={styles.inputGroup}>
                      <label>Numéro de téléphone</label>
                      <input type="text" placeholder="+216 XX XXX XXX" value={phone} onChange={(e)=>setPhone(e.target.value)} required />
                    </div>
                  )}

                  <div className={styles.inputGroup}>
                    <label>Mot de passe</label>
                    <input type="password" placeholder="Votre mot de passe" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                  </div>

                  {tab === 'inscription' && (
                    <div className={styles.inputGroup}>
                      <label>Confirmer le mot de passe</label>
                      <input type="password" placeholder="Confirmé votre mot de passe" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required />
                    </div>
                  )}

                  {tab === 'connexion' && (
                    <div className={styles.forgotPassword}>
                      <label><input type="checkbox"/> Se souvenir de moi</label>
                      <a href="#">Mot de passe oublié ?</a>
                    </div>
                  )}

                  <motion.button 
                    type="submit" 
                    className={styles.primaryBtn}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tab === 'connexion' ? 'Se connecter' : 'Créer mon compte'}
                  </motion.button>

                  <div className={styles.divider}>Or</div>

                  <motion.button 
                    type="button" 
                    className={styles.googleBtn} 
                    onClick={handleGoogleLogin}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" />
                    Sign in with Google
                  </motion.button>

                  {tab === 'connexion' ? (
                    <p className={styles.footerText}>
                      Vous n'avez pas de compte ? <span onClick={() => setTab('inscription')}>S'inscrire gratuitement</span>
                    </p>
                  ) : (
                    <p className={styles.footerText}>
                      Vous avez déjà un compte ? <span onClick={() => setTab('connexion')}>Se connecter</span>
                    </p>
                  )}
                </form>
              </motion.div>
            </div>
          </>
            ) : (
              /* ROLE SELECTION MODAL */
              <div className={styles.roleSelectionContainer}>
                <h2>Choisir Votre Type de compte</h2>
                <motion.button 
                  className={styles.roleCard} 
                  onClick={() => selectRole('CLIENT')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={styles.roleIcon}>👤</div>
                  <div className={styles.roleText}>Compte personnel</div>
                  <div className={styles.arrowIcon}>→</div>
                </motion.button>
                <motion.button 
                  className={styles.roleCard} 
                  onClick={() => selectRole('PROPRIETAIRE')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={styles.roleIcon}>🏠</div>
                  <div className={styles.roleText}>Compte propriétaries</div>
                  <div className={styles.arrowIcon}>→</div>
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
