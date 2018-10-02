import React from 'react';
import Link from 'gatsby-link';
import classnames from 'classnames';

import styles from './sideNav.module.scss';

const createMenuList = (listData, location) => (
  <ul className={styles.sideNav__sideList}>
    {listData.map( element => (
      <li key={element.title} className={styles.sideList__item}>
        {element.file && (
          <Link
            to={element.url || element.href}
            className={classnames([
              styles.subNav__link,
              location === element.url && styles['subNav__link--active'],
            ])}
          >
            {element.title}
          </Link>
        )}
        {!element.file && (
          <span className={styles.subNav__header}>{element.title}</span>
        )}
        {element.items && createMenuList(element.items, location)}
      </li>
    ))}
  </ul>
);

const SideNav = ({ activeNavData, location }) => (
  <div className={styles.sideNav__scrollableWrapper}>
    <nav className={styles.sideNav}>
      {createMenuList(activeNavData.sidemenu, location)}
    </nav>
  </div>
);

export default SideNav;
