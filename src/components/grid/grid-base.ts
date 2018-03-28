/**
 * GridBase
 */

import { Selection, TransitionLike, ContainerElement } from 'd3-selection'
import { AxisScale } from 'd3-axis'
import { SimpleContext, selectionFromContext, classArray } from '../../helpers'

// Direction orientations
const DIR = {
  H: 'horizontal',
  V: 'vertical',
}

/**
 * Interface defining a base grid.
 * The generic <Domain> is the type of the axis domain.
 * TODO: Doc comments for interface elements
 * TODO: Decide on return this vs GridBase<Domain> for accessors
 */
export interface GridBase<Domain> {
  (context: SimpleContext): void
  scale(): AxisScale<Domain>
  scale(_: AxisScale<Domain>): this
}

export function gridBase<Domain>(orient: string, scale: AxisScale<any>): GridBase<Domain> {
  let classArr = classArray('grid', orient)

  const gridBase = <GridBase<Domain>>function(context: SimpleContext) {
    let selection = selectionFromContext(context),
        initContainer = selection.selectAll(classArr.asSelector()).data([null]),
        container = initContainer.merge(
          initContainer.enter().append('g').attr('class', classArr.asList())
        )
  }

  // API

  gridBase.scale = function(_?: AxisScale<Domain>): any {
    return arguments.length ? (scale = _, this) : scale;
  }

  return gridBase
}

export function gridHorizontal<Domain>(scale: AxisScale<Domain>): GridBase<Domain> {
  return gridBase<Domain>(DIR.H, scale)
}
