import $ from 'jquery';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

export default class DebouncedTextInput extends React.Component {
  static propTypes = {
    queryChangeHandler: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.debouncedParentQueryChangeHandler = _.debounce(
      this.parentQueryChangeHandler.bind(this),
      200
    );
    this.queryChangeHandler = this.queryChangeHandler.bind(this);
    this.state = {
      queryObj: {
        query: null,
      },
    };
  }

  focus() {
    $(this.input).focus();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const queryDidChange = !_.isEqual(
      this.state.queryObj, nextState.queryObj
    );

    if (!queryDidChange) {
      return false;
    }

    this.debouncedParentQueryChangeHandler(nextState);
    return true;
  }

  queryChangeHandler(e) {
    const newQueryObj = Object.assign(
      {}, this.state.queryObj, {query: e.target.value}
    );
    this.setState({queryObj: newQueryObj});
  }

  parentQueryChangeHandler(nextState = null) {
    const state = nextState || this.state
    this.props.queryChangeHandler(state.queryObj);
  }

  render() {
    // We will use props.query if nothing has been typed: this way
    // a parent can "initialize" a starting query. This can be helpful
    // if they are restoring a query from persisted state.
    const stateQuery = this.state.queryObj.query;
    const query = (
      stateQuery !== null ? stateQuery : this.props.defaultQuery
    );

    return (
      <div className="form-group mr-2">
        <label className="mr-2" htmlFor="textInput">Search:</label>
        <input
          className="form-control"
          id="textInput"
          onChange={this.queryChangeHandler}
          ref={(input) => { this.input = input }}
          type="text"
          value={query}
        />
      </div>
    )
  }
}
