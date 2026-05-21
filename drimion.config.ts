export default {
	drimion: {
		corePath: "packages/toolkit/src/drimion",
		importAlias: "@pokeatlas/toolkit",
		naming: "kebab-case",
		targets: {
			aggregate: {
				ct: "./packages/domain/CollectionsTracking/aggregates",
				gm: "./packages/domain/GameMaster/aggregates",
			},
			entity: {
				ct: "./packages/domain/CollectionsTracking/entities",
				gm: "./packages/domain/GameMaster/entities",
			},
			repository: {
				ct: "./packages/domain/CollectionsTracking/repositories",
				gm: "./packages/domain/GameMaster/repositories",
			},
			usecase: {},
			valueObject: {
				ct: "./packages/domain/CollectionsTracking/value-objects",
				gm: "./packages/domain/GameMaster/value-objects",
			},
		},
	},
};
