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
    private startedAt: number | null = null;
    private elapsed = 0;
    private running = false;
    private laps: number[] = [];

    /**
     * Starts the stopwatch.
     */
    public start(): void {
        if (this.running) return;

        this.startedAt = Date.now();
        this.running = true;
    }

    /**
     * Pauses the stopwatch.
     */
    public pause(): void {
        if (!this.running || this.startedAt === null) return;

        this.elapsed += Date.now() - this.startedAt;
        this.startedAt = null;
        this.running = false;
    }

    /**
     * Resumes the stopwatch.
     */
    public resume(): void {
        this.start();
    }

    /**
     * Resets the stopwatch and clears all recorded laps.
     */
    public reset(): void {
        this.startedAt = null;
        this.elapsed = 0;
        this.running = false;
        this.laps = [];
    }

    /**
     * Returns total elapsed time in milliseconds.
     */
    public getElapsed(): number {
        if (!this.running || this.startedAt === null) {
            return this.elapsed;
        }

        return this.elapsed + Date.now() - this.startedAt;
    }

    /**
     * Records a lap without stopping the stopwatch.
     *
     * @returns Recorded lap's total elapsed time in milliseconds.
     */
    public lap(): number {
        if (!this.running) {
            throw new Error("Stopwatch must be running to record a lap");
        }

        const elapsed = this.getElapsed();

        this.laps.push(elapsed);

        return elapsed;
    }

    /**
     * Returns all recorded lap times.
     *
     * @returns Array of cumulative lap times in milliseconds.
     */
    public getLaps(): number[] {
        return [...this.laps];
    }

    /**
     * Returns the duration of the latest lap.
     */
    public getLastLap(): number {
        if (this.laps.length === 0) return 0;

        const last = this.laps[this.laps.length - 1];
        const previous = this.laps[this.laps.length - 2] ?? 0;

        return last - previous;
    }

    /**
     * Checks whether the stopwatch is running.
     */
    public isRunning(): boolean {
        return this.running;
    }
}
