import {List} from 'immutable';
import _ from 'lodash';
import React from 'react';

class Searcher extends React.Component {
  constructor(props) {
    super(props);

    this.state = {query: "", inputValue: ""};
    this.changeHandler = this.changeHandler.bind(this);
    this.setQueryState = _.debounce(this.setQueryState.bind(this), 200);
  }

  changeHandler(event) {
    this.setState({inputValue: event.target.value})
    this.setQueryState();
  }

  setQueryState() {
    this.setState({query: this.state.inputValue});
  }

  matchedItems() {
    if (this.state.query === "") {
      return List();
    }

    return this.props.searcher(this.state.query);
  }

  render() {
    const {component} = this.props;
    const Component = component;

    return (
      <div>
        <label>
          Search: <input type="text" value={this.state.inputValue} onChange={this.changeHandler}/>
        </label>
        <Component items={this.matchedItems()}/>
      </div>
    );
  }
}

export default Searcher;
