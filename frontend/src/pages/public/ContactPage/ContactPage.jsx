import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import './ContactPage.css';

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="contact-page">
      <Navbar />
      
      <main className="contact-main">
        {/* HERO SECTION */}
        <section className="contact-hero">
          <motion.div 
            className="contact-hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>Contactez-nous</h1>
            <p>Notre équipe est à votre disposition pour répondre à toutes vos questions</p>
          </motion.div>
        </section>

        {/* CONTACT CARDS */}
        <section className="contact-cards-section">
          <div className="contact-cards-container">
            <h2 className="section-title">Besoin d'aide supplémentaire ?</h2>
            <div className="contact-cards-grid">
              
              {/* Card 1 */}
              <motion.div 
                className="contact-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="contact-card-icon orange-bg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <h3>Chat en direct</h3>
                <p>Discutez avec notre équipe</p>
                <span className="contact-card-note">Disponible 24/7</span>
                <button className="contact-btn-outline">Démarrer une conversation</button>
              </motion.div>

              {/* Card 2 */}
              <motion.div 
                className="contact-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="contact-card-icon orange-bg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <h3>Email</h3>
                <p>support@rengo.tn</p>
                <span className="contact-card-note">Réponse sous 24h</span>
                <button className="contact-btn-outline">Envoyer un email</button>
              </motion.div>

              {/* Card 3 */}
              <motion.div 
                className="contact-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="contact-card-icon orange-bg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <h3>Téléphone</h3>
                <p>+216 70 123 456</p>
                <span className="contact-card-note">Lun–Ven 9h–18h</span>
                <button className="contact-btn-outline">Appeler maintenant</button>
              </motion.div>

            </div>
          </div>
        </section>

        {/* CONTACT FORM SECTION */}
        <section className="contact-form-section">
          <div className="contact-form-container">
            <motion.div 
              className="contact-form-wrapper"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2>Envoyez-nous un message</h2>
              <p className="contact-form-subtitle">Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.</p>
              
              <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label htmlFor="name">Nom complet</label>
                  <input type="text" id="name" placeholder="Votre nom complet" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" placeholder="votre.email@exemple.com" required />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Sujet</label>
                  <input type="text" id="subject" placeholder="Sujet de votre message" required />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" rows="5" placeholder="Comment pouvons-nous vous aider ?" required></textarea>
                </div>

                <button type="submit" className="contact-submit-btn">Envoyer le message</button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}