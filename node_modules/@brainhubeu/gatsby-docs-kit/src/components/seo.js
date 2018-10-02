import React, { Component } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';

class SEO extends React.Component {
    static propTypes = {
      siteMetadata: PropTypes.shape({
        description: PropTypes.string,
        image: PropTypes.string,
        url: PropTypes.string,
        type: PropTypes.string,
        title: PropTypes.string,
        siteName: PropTypes.string,
      }),
    };

    render() {
      const { siteMetadata } = this.props;
      return (
        <Helmet>
          <title>{siteMetadata.title}</title>

          {/* General tags */}
          { siteMetadata.description && <meta name="description" content={siteMetadata.description} /> }
          { siteMetadata.image && <meta name="image" content={siteMetadata.image} /> }

          {/* OpenGraph tags */}
          { siteMetadata.siteName && <meta property="og:site_name" content={siteMetadata.siteName} /> }
          { siteMetadata.url && <meta property="og:url" content={siteMetadata.url} /> }
          { siteMetadata.type && <meta property="og:type" content={siteMetadata.type} />}
          { siteMetadata.title && <meta property="og:title" content={siteMetadata.title} /> }
          { siteMetadata.description && <meta property="og:description" content={siteMetadata.description} /> }
          { siteMetadata.image && <meta property="og:image" content={siteMetadata.image} /> }
        </Helmet>
      );
    }
}


export default SEO;


