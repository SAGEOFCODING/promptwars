import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import BottomNav from './BottomNav';
import styles from './Layout.module.css';

const Layout = ({ children, currentTab, setCurrentTab, user }) => {
  return (
    <div className={styles.layout}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to content
      </a>
      <Header setCurrentTab={setCurrentTab} user={user} />
      <main id="main-content" className={styles.mainContent} role="main" tabIndex="-1">
        {children}
      </main>
      <nav aria-label="Bottom Navigation">
        <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
      </nav>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  currentTab: PropTypes.string.isRequired,
  setCurrentTab: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default Layout;
