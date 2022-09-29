import React, { Fragment } from 'react';
import styles from './UserLayout.less';

class UserLayout extends React.PureComponent {
  // @TODO title

  render() {
    const { children } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        {children}
      </div>
    );
  }
}

export default UserLayout;
