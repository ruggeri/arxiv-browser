import classNames from 'classnames';
import PaperItem from 'components/papers/shared/paper-item.jsx';
import Scroller from 'helpers/scroller';
import { List } from 'immutable';
import _ from 'lodash';
import React from 'react';

class PapersList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { selectedIndex: 0 };
    this.scroller = new Scroller({
      getElement: () => this.tbody,
      getItems: () => this.props.papers,
      getSelectedIndex: () => this.state.selectedIndex,
      updateSelectedIndex: (idx) => { this.setState({selectedIndex: idx}) },
    });
  }

  componentDidMount() {
    this.scroller.bind();
  }

  componentWillUnmount() {
    this.scroller.unbind();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !this.props.papers.equals(nextProps.papers)
      || !_.isEqual(this.state, nextState)
    );
  }

  render() {
    const { papers, showAuthors } = this.props;

    const paperItems = papers.map((paper, idx) => {
      const trClassNames = classNames({
        "table-active": idx == this.state.selectedIndex
      });
      return (
        <PaperItem
          paper={paper}
          showAuthors={showAuthors}
          key={paper.get('id')}
          className={trClassNames}
        />
      );
    });

    return (
      <table className="table table-striped">
        <tbody ref={tbody => {this.tbody = tbody}}>
          {paperItems}
        </tbody>
      </table>
    );
  }
}

export default PapersList;
