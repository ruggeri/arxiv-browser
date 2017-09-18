import { togglePaperStar } from 'actions/paper-status-actions';
import { togglePaperArchived } from 'actions/paper-status-actions';
import PaperItem from 'components/papers/shared/paper-item.jsx';
import ComponentStateStore from 'helpers/component-state-store';
import Scroller from 'helpers/scroller';
import { List } from 'immutable';
import _ from 'lodash';
import mousetrap from 'mousetrap';
import React from 'react';
import { connect as reactReduxConnect } from 'react-redux';
import { withRouter } from 'react-router';

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

    mousetrap.bind('s', () => {
      this.props.togglePaperStar(this.selectedPaper().get('id'));
    });
    mousetrap.bind('e', () => {
      this.props.togglePaperArchived(this.selectedPaper().get('id'));
    });
    mousetrap.bind('O', () => {
      const link = this.selectedPaper().get('link');
      window.open(link, '_blank');
    });
    mousetrap.bind('o', () => {
      // TODO: won't work until we use ReactRouter#withRouter.
      const paperId = this.selectedPaper().get('id');
      this.props.history.push(`/papers/${paperId}`);
    });
  }

  componentWillUnmount() {
    this.scroller.unbind();
    ['s', 'e', 'O', 'o'].forEach((k) => mousetrap.unbind(k));
  }

  selectedPaper() {
    return this.props.papers.get(this.state.selectedIndex);
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
      const trClassNames = {
        "active": idx == this.state.selectedIndex
      };

      return (
        <PaperItem
          paper={paper}
          showAuthors={showAuthors}
          key={paper.get('id')}
          classNames={trClassNames}
        />
      );
    });

    return (
      <div ref={tbody => {this.tbody = tbody}}>
        {paperItems}
      </div>
    );
  }
}

let PersistablePapersList = ComponentStateStore.connect(PapersList);

function connect(component) {
  component = withRouter(component);
  component = reactReduxConnect(
    (state) => ({}),
    (dispatch) => ({
      togglePaperStar: paperId => dispatch(togglePaperStar(paperId)),
      togglePaperArchived: paperId => dispatch(togglePaperArchived(paperId)),
    }),
  )(component)
  return component;
}

PapersList = connect(PapersList);
PersistablePapersList = connect(PersistablePapersList);

export {
  PapersList,
  PersistablePapersList,
};
