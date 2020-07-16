import React from 'react';
import Link from 'gatsby-link';

import styles from './landing.module.scss';

const LandingPage = () => (
  <div className={styles.landing}>
    <div>
      <h1 className={styles.landing__header}>React-carousel</h1>
      <p className={styles.landing__subheader}>
        A pure extendable React carousel, powered by{' '}
        <a href="https://brainhub.eu/">Brainhub</a> (craftsmen who ❤️ JS)
      </p>
      <div className={styles.btn__wrapper}>
        <Link to="/docs/gettingStarted" className={styles.landing__btn}>
          <span>Get started!</span>
        </Link>
      </div>
    </div>
  </div>
);

export default LandingPage;
