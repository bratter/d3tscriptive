import { DomFixture } from './dom-fixture'

/**
 * Create an SVG Fixture.
 */
export class SvgFixture extends DomFixture<SVGElement> {
  constructor() {
    super('<div class="test-container"><svg class="test-svg"></svg></div>', 'svg.test-svg')
  }
}
