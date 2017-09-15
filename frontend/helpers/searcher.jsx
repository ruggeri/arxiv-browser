import {List} from 'immutable';
import React from 'react';

class Searcher extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {query: ""};
    this.changeHandler = this.changeHandler.bind(this);
  }

  changeHandler(event) {
    this.setState({query: event.target.value});
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
          Search: <input type="text" value={this.state.query} onChange={this.changeHandler}/>
        </label>
        <Component items={this.matchedItems()}/>
      </div>
    );
  }
}

export default Searcher;
