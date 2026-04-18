import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import BottomNav from './BottomNav';
import styles from './Layout.module.css';

const Layout = ({ children, currentTab, setCurrentTab }) => {
  return (
    <div className={styles.layout}>
      <Header setCurrentTab={setCurrentTab} />
      <main className={styles.mainContent}>{children}</main>
      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  currentTab: PropTypes.string.isRequired,
  setCurrentTab: PropTypes.func.isRequired,
};

export default Layout;
