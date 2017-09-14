import React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.Component {
  render() {
    return (
      <div className="row">
        <ul>
          <li><Link to="/papers">Papers Inbox</Link></li>
          <li><Link to="/papers/starred">Starred papers</Link></li>
          <li><Link to="/authors/starred/papers">Starred author papers</Link></li>
        </ul>
      </div>
    );
  }
}

export default Header;
