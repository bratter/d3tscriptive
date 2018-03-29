import { Selection, TransitionLike, ContainerElement, BaseType } from 'd3-selection'
import { Transition } from 'd3-transition';

/**
 * Simple Selection type.
 * Provides basic types to the Selection generic, including a default element of BaseType.
 */
export type SimpleSelection<GElement extends BaseType = BaseType> = Selection<GElement, any, any, any>

/**
 * Simple TransitionLike type.
 * Provides basic types to the TransitionLike generic, including a default element of BaseType.
 */
export type SimpleTransitionLike<GElement extends BaseType = BaseType> = TransitionLike<GElement, any>

/**
 * Simple Transition type.
 * Provides basic types to the Transition generic, including a default element of BaseType.
 */
export type SimpleTransition<GElement extends BaseType = BaseType> = Transition<GElement, any, any, any>

/**
 * Context type.
 * Union of Selection and Transition for when either can be passed.
 */
export type Context<GElement extends BaseType, Datum, PElement extends BaseType, PDatum> 
  = Selection<GElement, Datum, PElement, PDatum>
  // | TransitionLike<GElement extends BaseType, Datum>
  | Transition<GElement, Datum, PElement, PDatum>

/**
 * Simple Context type.
 * Union of basic types to use when either a Selection or Transition is valid.
 */
// export type SimpleContext<GElement extends BaseType> = SimpleSelection<GElement> | SimpleTransitionLike<GElement>
export type SimpleContext<GElement extends BaseType = BaseType> = SimpleSelection<GElement> | SimpleTransition<GElement>

/**
 * Returns a Selection when passed a Context.
 * Used to get the selection inside transition-safe reusable chart objects.
 */
export function selectionFromContext<GElement extends BaseType = BaseType>(context: SimpleContext<GElement>): SimpleSelection<GElement> {
  // return (<SimpleTransitionLike<GElement>>context).selection
  //   ? (<SimpleTransitionLike<GElement>>context).selection() 
  return (<SimpleTransition<GElement>>context).selection
    ? (<SimpleTransition<GElement>>context).selection() 
    : <SimpleSelection<GElement>>context
}
