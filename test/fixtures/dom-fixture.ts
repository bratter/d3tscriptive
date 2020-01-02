/**
 * Class to set up and tear down dom fixtures for testing.
 */
export class DomFixture<ElType extends Element = Element> {
  /**
   * Create a new DomFixture.
   * @param content Raw html string content as the base for the fixture
   * @param selector Selector string indicate which element to return from the content
   */
  constructor(private content: string, private selector: string) {}

  /**
   * Setup the content of the DOM using the preset html string.
   */
  setup(): ElType {
    document.body.innerHTML = this.content;

    const el = document.querySelector<ElType>(this.selector);

    if (!el) throw new Error('The element to select does not exist and cannot be returned.');

    return el;
  }

  /**
   * Restore the content of the DOM.
   */
  teardown(): void {
    document.body.innerHTML = '';
  }
}
