import classNames from 'classnames';
import $ from 'jquery';
import React from 'react';

export default class SearchStateButtons extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.state = {
      query: {}
    };
  }

  buttonClassNames() {
    const {
      isIgnored,
      isReviewed,
      isSavedForLaterReading,
    } = this.state.query;

    return {
      isIgnored: classNames({
        fa: true,
        "fa-trash": isIgnored,
        "fa-trash-o": !isIgnored,
      }),

      isReviewed: classNames({
        fa: true,
        "fa-check-square": isReviewed,
        "fa-check-square-o": !isReviewed,
      }),

      isSavedForLaterReading: classNames({
        fa: true,
        "fa-file-text": isSavedForLaterReading,
        "fa-file-text-o": !isSavedForLaterReading,
      }),
    };
  }

  handleClick(e) {
    const stateName = $(e.currentTarget).data('state-name');
    const query = Object.assign({}, this.state.query);

    query[stateName] = !query[stateName];
    this.setState({query});
  }

  render() {
    const buttonClassNames = this.buttonClassNames();

    return (
      <div className="search-state-buttons">
        <span
          className="search-state-button"
          onClick={this.handleClick}
          data-state-name="isIgnored">
          <i className={buttonClassNames.isIgnored}/>{' '}
          <span className="action-name">isIgnored</span>
        </span>{' '}
        <span
          className="search-state-button"
          onClick={this.handleClick}
          data-state-name="isReviewed">
          <i className={buttonClassNames.isReviewed}/>{' '}
          <span className="action-name">isReviewed</span>
        </span>{' '}
        <span
          className="search-state-button"
          onClick={this.handleClick}
          data-state-name="isSavedForLaterReading">
          <i className={buttonClassNames.isSavedForLaterReading}/>{' '}
          <span className="action-name">isSavedForLaterReading</span>
        </span>
      </div>
    );
  }
}
