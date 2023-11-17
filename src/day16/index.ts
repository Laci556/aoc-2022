import { join } from 'path';
import { Challenge } from '../challenges';

type Valve = { flowRate: number; tunnels: string[]; open?: boolean };

type Valves = Record<string, Valve>;

const process = (
  current: string,
  valves: Valves,
  cache: Map<string, number>,
  route: string[],
  openableValves: number,
  totalMaxFlowRate: number,
  openValves = {} as Record<string, boolean>,
  flowRate = 0,
  totalFlow = 0,
  timeLeft = 30
): number => {
  if (timeLeft === 0) return totalFlow;

  if (Object.keys(openValves).length === openableValves) {
    if (totalFlow + flowRate * timeLeft === 1649)
      console.log(route.join(' -> '));
    return totalFlow + flowRate * timeLeft;
  }

  if (
    route.length > 4 &&
    route[route.length - 1] === route[route.length - 3] &&
    route[route.length - 2] === route[route.length - 4]
  ) {
    return 0;
  }

  const cacheKey = `${current}-${timeLeft}-${Object.keys(openValves)
    .sort()
    .join('')}`;
  const cacheVal = cache.get(cacheKey);
  if (cacheVal) return cacheVal;

  const currentValve = valves[current];
  const routes: number[] = [];
  if (currentValve.flowRate && !openValves[current]) {
    // try opening the valve
    const newRoute = process(
      current,
      valves,
      cache,
      route,
      openableValves,
      totalMaxFlowRate,
      { ...openValves, [current]: true },
      flowRate + currentValve.flowRate,
      totalFlow + flowRate,
      timeLeft - 1
    );
    routes.push(newRoute);
  }
  // try going through the tunnels
  for (const tunnel of currentValve.tunnels) {
    routes.push(
      process(
        tunnel,
        valves,
        cache,
        [...route, tunnel],
        openableValves,
        totalMaxFlowRate,
        openValves,
        flowRate,
        totalFlow + flowRate,
        timeLeft - 1
      )
    );
  }

  const maxFlow = Math.max(...routes);
  cache.set(cacheKey, maxFlow);

  return maxFlow;
};

const challenge: Challenge<Valves> = {
  inputPath: join(__dirname, './input.txt'),
  processInput: (input) =>
    input.split('\n').reduce((obj, line) => {
      const s = line.split(' ');
      const id = s[1],
        flowRate = +s[4].replace(/\D/g, ''),
        tunnels = s.slice(9).map((t) => t.replace(',', ''));
      obj[id] = {
        flowRate,
        tunnels,
      };
      return obj;
    }, {} as Record<string, { flowRate: number; tunnels: string[] }>),
  silver: (input) => {
    console.log(input);
    const cache = {};
    const cache2 = new Map<string, number>();
    const asd = process(
      'AA',
      input,
      cache2,
      ['AA'],
      Object.values(input).filter((v) => v.flowRate).length,
      Object.values(input).reduce((sum, valve) => sum + valve.flowRate, 0)
    );
    console.log(asd);
    return 0;
  },
  // gold: (input) => {},
};

export default challenge;
