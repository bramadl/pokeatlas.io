export function pipe<A, B>(a: A, ab: (a: A) => B): B;
export function pipe<A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C;
export function pipe<A, B, C, D>(
	a: A,
	ab: (a: A) => B,
	bc: (b: B) => C,
	cd: (c: C) => D,
): D;

/**
 * A represents ContainerBuilder.create()
 * B represents a slice
 * C represents a slice
 * and so on...
 *
 * We have:
 * - buildCollectionSlice -> B
 * - buildProgressSlice -> C
 *
 * Note: D -> a special spare slot, lol
 *
 * atm, this may be increased if the context is added even more (which less likely to be)
 */
export function pipe(
	initial: unknown,
	...fns: Array<(x: unknown) => unknown>
): unknown {
	return fns.reduce((acc, fn) => fn(acc), initial);
}
