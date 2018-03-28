import { Selection, TransitionLike, ContainerElement, BaseType } from 'd3-selection'

/**
 * Simple Selection type.
 * Provides basic types to the Selection generic.
 * TODO: Does it make sense for this to have a generic for the ContainerElement?
 */
export type SimpleSelection = Selection<ContainerElement, any, any, any>

/**
 * Simple TransitionLike type.
 * Provides basic types to the TransitionLike generic.
 */
export type SimpleTransitionLike = TransitionLike<ContainerElement, any>

/**
 * Context type.
 * Union of Selection and Transition for when either can be passed.
 */
export type Context<GElement extends BaseType, Datum, PElement extends BaseType, PDatum> 
  = Selection<GElement, Datum, PElement, PDatum> 
  | TransitionLike<GElement, Datum>

/**
 * Simple Context type.
 * Union of basic types to use when either a Selection or Transition is valid.
 */
export type SimpleContext = SimpleSelection | SimpleTransitionLike

/**
 * Returns a Selection when passed a Context.
 * Used to get the selection inside transition-safe reusable chart objects.
 */
export function selectionFromContext(context: SimpleContext): SimpleSelection {
  return (<SimpleTransitionLike>context).selection
    ? (<SimpleTransitionLike>context).selection() 
    : <SimpleSelection>context
}
