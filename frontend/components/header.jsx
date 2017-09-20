import React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.PureComponent {
  render() {
    return (
      <div className="row">
        <ul>
          <li><Link to="/papers/search">Papers</Link></li>
          <li><Link to="/authors/search">Authors</Link></li>
        </ul>
      </div>
    );
  }
}

export default Header;
