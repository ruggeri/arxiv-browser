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
      queryObj: null,
    };
  }

  handleChange(e) {
    const stateName = $(e.currentTarget).data('state-name');
    const newQueryObj = Object.assign(
      {},
      this.queryObj(),
      {[stateName]: !this.queryObj()[stateName]},
    );

    this.setState({queryObj: newQueryObj});
  }

  queryObj() {
    const stateQueryObj = this.state.queryObj;
    if (stateQueryObj !== null) {
      return stateQueryObj;
    } else if (this.props.defaultQueryObj) {
      return this.props.defaultQueryObj;
    } else {
      return {};
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(this.state.queryObj, nextState.queryObj)) {
      this.props.queryChangeHandler(nextState.queryObj)
      return true;
    }

    return false;
  }

  render() {
    const queryObj = this.queryObj();

    return (
      <div className="state-search-buttons">
        <label className="search-buttons-title">
          Filters:
        </label>
        <SearchStateButton
          onChange={this.handleChange}
          stateName="isAwaitingReview"
          value={queryObj.isAwaitingReview}/>{' '}
        <SearchStateButton
          onChange={this.handleChange}
          stateName="isIgnored"
          query={queryObj.isIgnored}/>{' '}
        <SearchStateButton
          onChange={this.handleChange}
          stateName="isReviewed"
          query={queryObj.isReviewed}/>{' '}
        <SearchStateButton
          onChange={this.handleChange}
          stateName="isSavedForLaterReading"
          query={queryObj.isSavedForLaterReading}/>{' '}
        <SearchStateButton
          onChange={this.handleChange}
          stateName="isPaperStarred"
          query={queryObj.isPaperStarred}/>{' '}
        <SearchStateButton
          onChange={this.handleChange}
          stateName="isAuthorStarred"
          query={queryObj.isAuthorStarred}/>{' '}
      </div>
    );
  }
}
