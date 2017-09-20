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
      query: null,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const queryDidChange = !_.isEqual(this.state.query, nextState.query);
    if (!queryDidChange) {
      return false;
    }

    this.debouncedParentQueryChangeHandler(nextState);
    return true;
  }

  queryChangeHandler(e) {
    this.setState({query: e.target.value});
  }

  parentQueryChangeHandler(nextState = null) {
    const state = nextState || this.state
    this.props.queryChangeHandler(state.query);
  }

  render() {
    // We will use props.query if nothing has been typed: this way
    // a parent can "initialize" a starting query. This can be helpful
    // if they are restoring a query from persisted state.
    const query = this.state.query !== null ? this.state.query : this.props.query;

    return (
      <div>
        <label>
          Search:{' '}
          <input type="text" onChange={this.queryChangeHandler} value={query}/>
        </label>
      </div>
    )
  }
}
