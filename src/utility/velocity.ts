export function getVelocity(duration: number, length: number): number {
  const fps = 60;
  const cycle = length / fps;
  const velocity = Math.ceil(cycle / (duration / 1000));
  return velocity;
}
