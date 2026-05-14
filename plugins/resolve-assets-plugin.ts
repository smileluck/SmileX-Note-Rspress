export interface ResolveAssetsPluginOptions {
  prefixes?: string[];
}

export class ResolveAssetsPlugin {
  private prefixes: string[];

  constructor(options: ResolveAssetsPluginOptions = {}) {
    this.prefixes = options.prefixes || ['_assets/'];
  }

  apply(compiler: any) {
    const prefixes = this.prefixes;
    compiler.hooks.normalModuleFactory.tap("ResolveAssetsPlugin", (nmf: any) => {
      nmf.hooks.beforeResolve.tap("ResolveAssetsPlugin", (resolveData: any) => {
        const matched = prefixes.some(
          p => resolveData.request.startsWith(p) &&
               !resolveData.request.startsWith("./") &&
               !resolveData.request.startsWith("/") &&
               !resolveData.request.includes("://")
        );
        if (matched) {
          if (
            resolveData.contextInfo.issuer &&
            /\.(md|mdx)$/.test(resolveData.contextInfo.issuer)
          ) {
            console.log(
              `[ResolvePlugin] Intercepted: ${resolveData.request} from ${resolveData.contextInfo.issuer}`
            );
            resolveData.request = `./${resolveData.request}`;
          }
        }
      });
    });
  }
}

