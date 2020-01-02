/**
 * Utility function to delay execution by a number of miliseconds.
 * @param time Time in ms to delay
 */
export function delay(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

/**
 * Utility function to pause execution until the next loop.
 */
export function tick(): Promise<void> {
  return delay(0);
}
