/**
 * Countdown Timer
 *
 * Creates a countdown timer with pause and resume support.
 *
 * @example
 * const timer = new Timer(60000); // 1 minute
 *
 * timer.start();
 * log(timer.getRemaining());
 *
 * timer.pause();
 * timer.resume();
 *
 * log(timer.isFinished());
 */
export default class Timer {
    private duration;
    private startedAt;
    private elapsed;
    private running;
    /**
     * @param duration - Countdown duration in milliseconds.
     */
    constructor(duration: number);
    /**
     * Starts the countdown timer.
     */
    start(): void;
    /**
     * Pauses the countdown timer.
     */
    pause(): void;
    /**
     * Resumes a paused countdown timer.
     */
    resume(): void;
    /**
     * Resets the countdown timer to its original duration.
     */
    reset(): void;
    /**
     * Returns elapsed time in milliseconds.
     */
    getElapsed(): number;
    /**
     * Returns remaining time in milliseconds.
     */
    getRemaining(): number;
    /**
     * Checks whether the timer is currently running.
     */
    isRunning(): boolean;
    /**
     * Checks whether the countdown has finished.
     */
    isFinished(): boolean;
    /**
     * Returns the original countdown duration.
     */
    getDuration(): number;
}
