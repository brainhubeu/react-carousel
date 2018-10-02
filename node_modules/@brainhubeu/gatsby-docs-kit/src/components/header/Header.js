import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';
import menuPagesProptypes from '../../utils/menu-proptypes';
import GithubIcon from './GithubIcon';

import styles from './header.module.scss';


class Header extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
    this.listItemWith = 0;

    this.state = {
      mobileMenu: false,
      mainNavItemsWidth: 0,
      menuIsOpen: false,
    };
  }

  componentDidMount = () => {
    const listChildren = Array.from(this.listRef.current.children[0].children);
    this.listItemWidth = this.getItemListWidth(listChildren);

    this.setState({
      mobileMenu: this.listRef.current.clientWidth < this.listItemWidth,
    });

    window.addEventListener('resize', this.updateDimensions);
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({
      mobileMenu: this.listRef.current.clientWidth < this.listItemWidth,
    });
  };

  getItemListWidth = navArray => {
    let navWidth = 0;

    navArray.forEach(element => {
      navWidth += element.clientWidth;
    });

    return navWidth;
  };

  toggleMenu = () => {
    this.setState({ menuIsOpen: !this.state.menuIsOpen });
  };

  render() {
    const { menuPages, activeNavTitle, githubUrl } = this.props;
    return (
      <header
        className={classnames([
          styles.header,
          this.state.mobileMenu && styles['header--mobile'],
        ])}
      >
        <svg width="119px" height="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 114.06 15.12" fill="#fff" className={styles.header__logo}>
          <rect x="0.38" y="-0.38" width="2.58" height="3.33" transform="translate(0.38 2.96) rotate(-90)" />
          <rect x="6.84" y="12.2" width="2.58" height="2.58" transform="translate(-5.36 21.63) rotate(-90)" />
          <rect x="63.57" width="2.58" height="2.58" transform="translate(63.57 66.15) rotate(-90)" />
          <polygon points="14.09 0 11.3 0 6.02 0 6.02 2.58 11.3 2.58 14.09 2.58 20.93 2.58 20.93 0 14.09 0" />
          <rect x="0.86" y="11.35" width="2.58" height="4.29" transform="translate(-11.35 15.64) rotate(-90)" />
          <rect x="7.39" y="1.98" width="2.58" height="10.83" transform="translate(1.29 16.07) rotate(-90)" />
          <path d="M86.66,4.41H86.2a9.44,9.44,0,0,0-2.26.36V.69H81.28V14.79h2.66v-7a3.08,3.08,0,0,1,2.26-.84,1.25,1.25,0,0,1,1.07.43,2.44,2.44,0,0,1,.32,1.43v6h2.69V8.68C90.27,6,89.06,4.5,86.66,4.41Z" />
          <path d="M110.45,4.41H110a9.44,9.44,0,0,0-2.26.36V.69h-2.66V14.79h2.66v-.36A5.74,5.74,0,0,0,110,15h.46c2.4-.09,3.62-1.6,3.62-4.27V8.68C114.06,6,112.85,4.5,110.45,4.41Zm.93,6.24a2.44,2.44,0,0,1-.32,1.43,1.25,1.25,0,0,1-1.07.43,3.08,3.08,0,0,1-2.26-.84V7.74A3.08,3.08,0,0,1,110,6.89a1.25,1.25,0,0,1,1.07.43,2.44,2.44,0,0,1,.32,1.43Z" />
          <path d="M55,4.41c-2.4.09-3.62,1.6-3.62,4.27v2.05c0,2.67,1.21,4.18,3.62,4.27h.46a7.19,7.19,0,0,0,2.26-.46v.4h2.66V6.2a7.46,7.46,0,0,0-4.91-1.78Zm2.72,7.26a3.08,3.08,0,0,1-2.26.84,1.25,1.25,0,0,1-1.07-.43,2.45,2.45,0,0,1-.32-1.43V8.76a2.45,2.45,0,0,1,.32-1.43,1.25,1.25,0,0,1,1.07-.43,3.08,3.08,0,0,1,2.26.84Z" />
          <rect x="63.54" y="4.82" width="2.64" height="9.97" />
          <path d="M40.1,7.19A4.32,4.32,0,0,0,36.85,0H31V14.79h6.22a4.32,4.32,0,0,0,2.85-7.6ZM36.85,2.58a1.76,1.76,0,1,1,0,3.52H33.62V2.58Zm.4,9.62H33.62V8.68h3.64a1.76,1.76,0,1,1,0,3.52Z" />
          <path d="M74.61,4.41h-.46A7.46,7.46,0,0,0,69.24,6.2v8.58h2.66v-7a3.08,3.08,0,0,1,2.26-.84,1.25,1.25,0,0,1,1.07.43,2.44,2.44,0,0,1,.32,1.43v6h2.69V8.68C78.23,6,77,4.5,74.61,4.41Z" />
          <path d="M99.14,11.79a3.08,3.08,0,0,1-2.26.84,1.25,1.25,0,0,1-1.07-.43,2.45,2.45,0,0,1-.32-1.43v-6H92.8v6.11c0,2.67,1.21,4.18,3.62,4.27h.46a7.46,7.46,0,0,0,4.91-1.78V4.74H99.14Z" />
          <path d="M48.78,4.69a7.46,7.46,0,0,0-4.91,1.78v8.32h2.66V8a3.16,3.16,0,0,1,2.27-.89,6.18,6.18,0,0,1,1.14.09V4.69H48.78Z" />
          <rect x="17.51" y="5.26" width="2.58" height="4.26" transform="translate(11.41 26.2) rotate(-90)" />
          <rect x="15.2" y="9.05" width="2.58" height="8.89" transform="translate(2.99 29.98) rotate(-90)" />
        </svg>
        <div className={styles.header__menuWrapper}>
          <nav className={styles.header__nav} ref={this.listRef}>
            <ul
              className={classnames([
                styles.nav__list,
                this.state.menuIsOpen && styles['nav__list--mobile__open'],
              ])}

            >
              {menuPages.map(( element, index ) => (
                <li key={index} className={styles.nav__item}>
                  <Link
                    to={element.url}
                    className={classnames([
                      styles.nav__link,
                      activeNavTitle === element.title ? styles[`nav__link--active`] : null,
                    ])}
                    data-after={element.title}
                    onClick={this.toggleMenu}
                  >
                    <span>{element.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.menu__btnsWrapper}>
            { githubUrl
            && (
              <a href={githubUrl} target="_blank" className={styles.header__github}>
                <GithubIcon/>
              </a>
            )
            }
            {
              this.state.mobileMenu && (
                <button
                  className={classnames([
                    styles.header__mobileBtn,
                    this.state.menuIsOpen && styles['header__mobileBtn--active'],
                  ])}
                  onClick={this.toggleMenu}
                >
                  <span className={styles.mobileBtn__hamburger} />
                </button>
              )
            }
          </div>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  location: PropTypes.string,
  activeNavTitle: PropTypes.string,
  menuPages: menuPagesProptypes,
  githubUrl: PropTypes.string,
};

export default Header;
