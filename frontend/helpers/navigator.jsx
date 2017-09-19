import React from 'react';
import { withRouter } from 'react-router';

class Navigator extends React.Component {
  componentWillMount() {
    this.handler = (e) => {
      if (e.target instanceof HTMLInputElement) {
        return;
      } else if (e.key == "b") {
        this.props.history.goBack();
      } else if (e.key == "f") {
        this.props.history.goForward();
      }
    };

    $(document.body).keydown(this.handler);
  }

  componentWillUnmount() {
    $(document.body).unbind('keydown', this.handler);
  }

  render() {
    return null;
  }
}

Navigator = withRouter(Navigator);

export default Navigator;
