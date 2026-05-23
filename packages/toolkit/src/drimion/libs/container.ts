/**
 * @drimion/container
 *
 * A lightweight, type-safe, fluent dependency wiring system.
 * No libraries. No decorators. No proxies. Pure TypeScript.
 */

// biome-ignore lint/suspicious/noExplicitAny: intentional structural wildcard
type AnyTokenMap = Record<string, any>;

type Resolved<Reg extends AnyTokenMap> = {
	[K in keyof Reg]: ReturnType<Reg[K]>;
};

export class ContainerBuilder<
	Reg extends Record<string, (resolved: AnyTokenMap) => unknown> = Record<
		never,
		never
	>,
> {
	private constructor(
		private readonly _entries: Array<{
			token: string;
			factory: (resolved: AnyTokenMap) => unknown;
		}>,
	) {}

	static create(): ContainerBuilder<Record<never, never>> {
		return new ContainerBuilder([]);
	}

	add<K extends string, T>(
		token: K,
		factory: (resolved: Resolved<Reg>) => T,
	): ContainerBuilder<Reg & Record<K, (resolved: AnyTokenMap) => T>> {
		return new ContainerBuilder<Reg & Record<K, (resolved: AnyTokenMap) => T>>([
			...this._entries,
			{ factory: factory as (r: AnyTokenMap) => T, token },
		]);
	}

	build(): Resolved<Reg> {
		const resolved: AnyTokenMap = {};

		for (const { token, factory } of this._entries) {
			if (token in resolved) {
				throw new Error(
					`[Container] Duplicate token "${token}". Each token must be registered exactly once.`,
				);
			}
			try {
				resolved[token] = factory(resolved);
			} catch (err) {
				throw new Error(
					`[Container] Failed to resolve token "${token}": ${(err as Error).message}`,
					{ cause: err },
				);
			}
		}

		return Object.freeze(resolved) as Resolved<Reg>;
	}

	from<ExternalReg extends AnyTokenMap>(
		external: ExternalReg,
		keys: (keyof ExternalReg)[],
	): ContainerBuilder<Reg & Pick<ExternalReg, (typeof keys)[number]>> {
		const pickedEntries = keys.map((key) => ({
			factory: () => external[key],
			token: key as string,
		}));
		return new ContainerBuilder([...this._entries, ...pickedEntries]);
	}
}
