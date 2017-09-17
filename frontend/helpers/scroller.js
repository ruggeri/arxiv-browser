export default class Scroller {
  constructor(options) {
    const {
      getElement,
      getItems,
      getSelectedIndex,
      updateSelectedIndex
    } = options;

    this.getElement = getElement;
    this.getItems = getItems;
    this.getSelectedIndex = getSelectedIndex;
    this.updateSelectedIndex = updateSelectedIndex;
  }

  advanceSelectedIndex(increment) {
    const selectedIndex = this.getSelectedIndex();
    const itemsCount = this.getItems().count();

    let newSelectedIndex = selectedIndex + increment;
    if (newSelectedIndex < 0) {
      newSelectedIndex = 0;
    } else if (newSelectedIndex >= itemsCount) {
      newSelectedIndex = itemsCount - 1;
    }

    this.updateSelectedIndex(newSelectedIndex);
    this.maybeScrollTo(newSelectedIndex);
  }

  bind() {
    this.handler = (e) => {
      if (e.target instanceof HTMLInputElement) {
        return;
      } else if (e.key == "j") {
        this.advanceSelectedIndex(1);
      } else if (e.key == "k") {
        this.advanceSelectedIndex(-1);
      }
    };

    $(document.body).keydown(this.handler);
  }

  maybeScrollTo(selectedIndex) {
    const selectedItemId = this.getItems().get(selectedIndex).get('id');

    const selectedElement = $(this.getElement()).children(
      `[data-id="${selectedItemId}"]`
    );
    const selectedTop = selectedElement.offset().top;
    const selectedBottom = selectedTop + selectedElement.innerHeight();
    const windowTop = window.scrollY
    const windowBottom = windowTop + window.innerHeight;

    if (selectedTop < windowTop) {
      window.scroll(0, selectedTop);
    } else if (selectedBottom > windowBottom) {
      window.scroll(0, selectedBottom - window.innerHeight);
    }
  }

  unbind() {
    $(document.body).off("keydown", this.handler);
  }
}
