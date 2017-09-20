import classNames from 'classnames';
import $ from 'jquery';
import React from 'react';

const SearchStateButton = ({onChange, stateName, value}) => (
  <label className="form-check-label mr-2">
    <input
      className="form-check-input"
      type="checkbox"
      onChange={onChange}
      data-state-name={stateName}
      value={value}/>{' '}
    {stateName}
  </label>
)

export default class SearchStateButtons extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.state = {
      query: {},
    };
  }

  handleChange(e) {
    const stateName = $(e.currentTarget).data('state-name');
    const query = Object.assign({}, this.state.query);

    query[stateName] = !query[stateName];
    this.setState({query});
  }

  render() {
    const {query} = this.state;

    return (
      <div className="form-check search-state-checkboxes">
        <SearchStateButton
          onChange={this.handleChange}
          stateName="isAwaitingReview"
          value={query.isAwaitingReview}/>{' '}
        <SearchStateButton
          onChange={this.handleChange}
          stateName="isIgnored"
          query={query.isIgnored}/>{' '}
        <SearchStateButton
          onChange={this.handleChange}
          stateName="isReviewed"
          query={query.isReviewed}/>{' '}
        <SearchStateButton
          onChange={this.handleChange}
          stateName="isSavedForLaterReading"
          query={query.isSavedForLaterReading}/>{' '}
      </div>
    );
  }
}
