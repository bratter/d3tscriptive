/**
 * Class to set up and tear down dom fixtures for testing
 * TODO: Create two sub-classes, one each for div and svg
 */
export class Fixtures {
  static div = '<div class="test-container a"></div>'
  static svg = '<div class="test-container"><svg class="test-svg"></svg></div>'

  div(): void {
    this.setup(Fixtures.div)
  }

  svg(): void {
    this.setup(Fixtures.svg)
  }

  setup(content: string): void {
    document.body.innerHTML = content
  }

  teardown(): void {
    document.body.innerHTML = ''
  }
}
