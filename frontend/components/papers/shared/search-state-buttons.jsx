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
      queryObj: {},
    };
  }

  handleChange(e) {
    const stateName = $(e.currentTarget).data('state-name');
    const newQueryObj = Object.assign(
      {},
      this.state.queryObj,
      {[stateName]: !this.state.queryObj[stateName]},
    );

    this.setState({queryObj: newQueryObj});
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(this.state.queryObj, nextState.queryObj)) {
      this.props.queryChangeHandler(nextState.queryObj)
      return true;
    }

    return false;
  }

  render() {
    const {queryObj} = this.state;

    return (
      <div className="form-check search-state-checkboxes">
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
      </div>
    );
  }
}
