// // https://github.com/unjs/unbuild

import { defineBuildConfig } from "unbuild";

const config = defineBuildConfig({
	entries: ["./src/index"],
	declaration: "compatible",
	rollup: {
		emitCJS: true,
		inlineDependencies: true,
	}
});

export default config;
