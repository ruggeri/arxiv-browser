import { togglePaperStar } from 'actions/paper-status-actions';
import { togglePaperArchived } from 'actions/paper-status-actions';
import classNames from 'classnames';
import PaperItem from 'components/papers/shared/paper-item.jsx';
import Scroller from 'helpers/scroller';
import { List } from 'immutable';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

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
    this.handler = (e) => {
      if (e.target instanceof HTMLInputElement) {
        return;
      } else if (e.key == "s") {
        this.props.togglePaperStar(this.selectedPaper().get('id'));
      } else if (e.key == "e") {
        this.props.togglePaperArchived(this.selectedPaper().get('id'));
      } else if (e.key == "o") {
        console.log("Open this!")
      }
    }

    $(document.body).keydown(this.handler);
  }

  componentWillUnmount() {
    this.scroller.unbind();
    $(document.body).off("keydown", this.handler);
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

PapersList = connect(
  (state) => ({}),
  (dispatch) => ({
    togglePaperStar: paperId => dispatch(togglePaperStar(paperId)),
    togglePaperArchived: paperId => dispatch(togglePaperArchived(paperId)),
  }),
)(PapersList)

export default PapersList;
