import PropTypes from 'prop-types';

const menuPropTypes = {
  title: PropTypes.string,
  file: PropTypes.string,
  relativePath: PropTypes.string,
  absolutePath: PropTypes.string,
  url: PropTypes.string,
  hash: PropTypes.string,
};

export default PropTypes.arrayOf(PropTypes.shape({
  title: PropTypes.string,
  dir: PropTypes.string,
  file: PropTypes.string,
  relativePath: PropTypes.string,
  absolutePath: PropTypes.string,
  template: PropTypes.string,
  layout: PropTypes.string,
  href: PropTypes.string,
  url: PropTypes.string,
  sidemenu: PropTypes.arrayOf(PropTypes.shape({
    ...menuPropTypes,
    items: PropTypes.arrayOf(PropTypes.shape({
      ...menuPropTypes,
      items: PropTypes.arrayOf(PropTypes.shape(
        menuPropTypes
      )),
    })),
  })),
}));
