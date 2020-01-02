/**
 * Classes Helper Functions
 */

export interface ClassArray {
  asList(): string;
  asSelector(): string ;
}

export function classArray(classes: string[]): ClassArray;
export function classArray(classes: string, ...classRest: string[]): ClassArray;
export function classArray(classes: string[]|string, ...classRest: string[]): ClassArray {
  const classArr = Array.isArray(classes) ? classes : [classes, ...classRest];

  return {
    asList: (): string => classArr.join(' '),
    asSelector: (): string => `.${classArr.join('.')}`,
  };
}
