import React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.PureComponent {
  render() {
    return (
      <div className="row">
        <ul>
          <li>
            Papers
            <ul>
              <li><Link to="/papers">Papers Inbox</Link></li>
              <li><Link to="/papers/starred">Starred papers</Link></li>
              <li><Link to="/authors/starred/papers">Starred author papers</Link></li>
            </ul>
          </li>

          <li>
            Authors
            <ul>
              <li><Link to="/authors">All Authors</Link></li>
              <li><Link to="/authors/starred">Starred Authors</Link></li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
}

export default Header;
