import { List } from 'immutable';
import React from 'react';
import { PagerHelper } from './pager-helper';

// The Pager is a React Higher-Order component that "phases in" updates
// to a list of items. When `props.items` changes, the Pager
// incrementally updates `state.items` using the PagerHelper class.
// It is `state.items` that gets passed to the wrapped component.
//
// This helps because when a large number of items in a list changes,
// that can entail unmounting a lot of old item components and mounting
// a bunch of new ones. That can be very slow. And because that blocks
// the main thread, the user experiences lockup until React is done
// updating.
//
// The Pager HOC breaks this up into small incremental chunks of updates
// each of which should execute quickly and allow user interaction to
// interleave with the updates.
export class Pager extends React.Component {
  constructor(props) {
    super(props);

    this.pager = new PagerHelper({
      pageSize: this.props.pageSize,
      setCurrentItems: currentItems => {
        this.setState({items: currentItems});
      },
    });

    this.state = {items: List()};
  }

  componentDidMount() {
    this.pager.pageIn(this.state.items, this.props.items);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.items.equals(this.props.items)) {
      this.pager.pageIn(this.state.items, nextProps.items);
    }
  }

  componentWillUnmount() {
    this.pager.stopWorkers();
  }

  render() {
    const Component = this.props.component;
    return <Component items={this.state.items}/>;
  }
}
