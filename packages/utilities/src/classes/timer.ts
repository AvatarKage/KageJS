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
    private duration: number;
    private startedAt: number | null = null;
    private elapsed = 0;
    private running = false;

    /**
     * @param duration - Countdown duration in milliseconds.
     */
    constructor(duration: number) {
        if (!Number.isFinite(duration) || duration <= 0) {
            throw new Error("Duration must be greater than zero");
        }

        this.duration = duration;
    }

    /**
     * Starts the countdown timer.
     */
    public start(): void {
        if (this.running || this.isFinished()) return;

        this.startedAt = Date.now();
        this.running = true;
    }

    /**
     * Pauses the countdown timer.
     */
    public pause(): void {
        if (!this.running || this.startedAt === null) return;

        this.elapsed += Date.now() - this.startedAt;
        this.startedAt = null;
        this.running = false;
    }

    /**
     * Resumes a paused countdown timer.
     */
    public resume(): void {
        this.start();
    }

    /**
     * Resets the countdown timer to its original duration.
     */
    public reset(): void {
        this.elapsed = 0;
        this.startedAt = null;
        this.running = false;
    }

    /**
     * Returns elapsed time in milliseconds.
     */
    public getElapsed(): number {
        if (!this.running || this.startedAt === null) {
            return this.elapsed;
        }

        return this.elapsed + Date.now() - this.startedAt;
    }

    /**
     * Returns remaining time in milliseconds.
     */
    public getRemaining(): number {
        return Math.max(0, this.duration - this.getElapsed());
    }

    /**
     * Checks whether the timer is currently running.
     */
    public isRunning(): boolean {
        return this.running;
    }

    /**
     * Checks whether the countdown has finished.
     */
    public isFinished(): boolean {
        return this.getRemaining() === 0;
    }

    /**
     * Returns the original countdown duration.
     */
    public getDuration(): number {
        return this.duration;
    }
}
