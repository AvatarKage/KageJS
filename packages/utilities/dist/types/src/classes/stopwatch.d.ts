/**
 * Stopwatch
 *
 * Measures elapsed time with pause, resume, reset,
 * and lap tracking functionality.
 *
 * @example
 * const stopwatch = new Stopwatch();
 *
 * stopwatch.start();
 *
 * stopwatch.lap();
 * stopwatch.lap();
 *
 * log(stopwatch.getElapsed());
 * log(stopwatch.getLaps());
 *
 * stopwatch.pause();
 * stopwatch.resume();
 * stopwatch.reset();
 */
export default class Stopwatch {
    private startedAt;
    private elapsed;
    private running;
    private laps;
    /**
     * Starts the stopwatch.
     */
    start(): void;
    /**
     * Pauses the stopwatch.
     */
    pause(): void;
    /**
     * Resumes the stopwatch.
     */
    resume(): void;
    /**
     * Resets the stopwatch and clears all recorded laps.
     */
    reset(): void;
    /**
     * Returns total elapsed time in milliseconds.
     */
    getElapsed(): number;
    /**
     * Records a lap without stopping the stopwatch.
     *
     * @returns Recorded lap's total elapsed time in milliseconds.
     */
    lap(): number;
    /**
     * Returns all recorded lap times.
     *
     * @returns Array of cumulative lap times in milliseconds.
     */
    getLaps(): number[];
    /**
     * Returns the duration of the latest lap.
     */
    getLastLap(): number;
    /**
     * Checks whether the stopwatch is running.
     */
    isRunning(): boolean;
}
