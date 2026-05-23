export default {
	drimion: {
		corePath: "packages/toolkit/src/drimion",
		importAlias: "@pokeatlas/toolkit",
		naming: "kebab-case",
		targets: {
			aggregate: {
				collection: "packages/contexts/collection-context/src/core/aggregates",
			},
			entity: {
				collection: "packages/contexts/collection-context/src/core/entities",
			},
			repository: {
				collection:
					"packages/contexts/collection-context/src/core/repositories",
			},
			usecase: {},
			valueObject: {
				collection:
					"packages/contexts/collection-context/src/core/value-objects",
			},
		},
	},
};
