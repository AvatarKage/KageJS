import node from "node:os";
import si from "systeminformation";

type Mode = "simple" | "advanced";

function stripTrademarkSymbols(text: string): string {
    return text
        .replaceAll("(R)", "")
        .replaceAll("(TM)", "")
        .replaceAll("®", "")
        .replaceAll("™", "")
        .trim();
}

export const os = {
    async cpu(mode: Mode = "simple") {
        const isAdvanced = mode === "advanced";

        const [info, temperature, load, currentSpeed, cache, flags] =
            await Promise.all([
                si.cpu(),
                si.cpuTemperature(),
                si.currentLoad(),
                si.cpuCurrentSpeed(),
                isAdvanced ? si.cpuCache() : Promise.resolve(null),
                isAdvanced ? si.cpuFlags() : Promise.resolve(null),
            ]);

        const cpus = node.cpus();

        const threads = cpus.map((cpu, id) => ({
            id,
            speed: cpu.speed / 1000,
            ...(isAdvanced && cpu.times && {
                times: cpu.times,
            })
        }));

        return {
            name: stripTrademarkSymbols(cpus[0]?.model) || stripTrademarkSymbols(info.brand),
            manufacturer: info.manufacturer,
            cores: info.cores,
            processors: info.processors,
            threads,
            speed: currentSpeed.avg,
            speedMax: currentSpeed.max,
            speedMin: currentSpeed.min,
            usage: load.currentLoad,
            ...(isAdvanced && cache && {
                cache: {
                    l1d: cache.l1d,
                    l1i: cache.l1i,
                    l2: cache.l2,
                    l3: cache.l3,
                },
            }),
            ...(temperature.main != null && {
                temperature: temperature.main,
            }),
            ...(isAdvanced && flags && {
                flags: flags.split(" "),
            }),
            memory: {
                total: node.totalmem(),
                free: node.freemem(),
                used: node.totalmem() - node.freemem(),
            },
        };
    }
};
