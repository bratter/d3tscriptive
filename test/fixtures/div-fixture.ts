import { DomFixture } from './dom-fixture';

/**
 * Create a DIV Fixture.
 */
export class DivFixture extends DomFixture<HTMLDivElement> {
  constructor() {
    super('<div class="test-container"></div>', 'div.test-container');
  }
}
