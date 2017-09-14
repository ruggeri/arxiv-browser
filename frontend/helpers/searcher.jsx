import {List} from 'immutable';
import React from 'react';

class SearchInput extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {query: ""};

    this.changeHandler = this.changeHandler.bind(this);
  }

  changeHandler(event) {
    this.setState({query: event.target.value});
    this.props.changeHandler(event.target.value);
  }

  render() {
    const {query} = this.props;

    return (
      <label>
        Search: <input type="text" value={query} onChange={this.changeHandler}/>
      </label>
    );
  }
}

class Searcher extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {items: List()};
    this.changeHandler = this.changeHandler.bind(this);
  }

  changeHandler(query) {
    if (query === "") {
      this.setState({items: List()});
      return;
    }

    const {searchFieldName} = this.props;
    query = query.toLowerCase();
    console.log(query);
    const matchedItems = this.props.items.filter(item => {
      return item.get(searchFieldName).toLowerCase().includes(query)
    })

    this.setState({items: matchedItems});
  }

  render() {
    const {component} = this.props;
    const {items} = this.state;
    const Component = component;

    return (
      <div>
        <SearchInput changeHandler={this.changeHandler}/>
        <Component items={items}/>
      </div>
    );
  }
}

export default Searcher;
