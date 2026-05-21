export default {
	drimion: {
		corePath: "packages/toolkit/src/drimion",
		importAlias: "@pokeatlas/toolkit",
		naming: "kebab-case",
		targets: {
			aggregate: {
				ct: "./packages/contexts/src/collections-tracking/domain/aggregates",
				gm: "./packages/contexts/src/game-masters/domain/aggregates",
			},
			entity: {
				ct: "./packages/contexts/src/collections-tracking/domain/entities",
				gm: "./packages/contexts/src/game-masters/domain/entities",
			},
			repository: {
				ct: "./packages/contexts/src/collections-tracking/domain/repositories",
				gm: "./packages/contexts/src/game-masters/domain/repositories",
			},
			usecase: {},
			valueObject: {
				ct: "./packages/contexts/src/collections-tracking/domain/value-objects",
				gm: "./packages/contexts/src/game-masters/domain/value-objects",
			},
		},
	},
};
