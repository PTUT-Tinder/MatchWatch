import svelte from "rollup-plugin-svelte";
import fg from "fast-glob";
import path from "path";

const htmlFiles = fg.sync("app/**/*.html").reduce((acc, val) => ({
	...acc,
	[path.posix.normalize(val.replace(/^app\/|\.html$/gi, ""))]: path.resolve(val),
}), {});

export default {
	plugins: [svelte({
		emitCss: false,
	})],
	root: "app",
	build: {
		outDir: "../public",
		rollupOptions: {
			input: htmlFiles,
		},
	},
	server: {
		proxy: {
			'/api': 'http://localhost:5000/',
		}
	}
};
