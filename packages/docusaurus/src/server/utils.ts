/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {RouteConfig} from '@docusaurus/types';
import path from 'path';
import {posixPath, Globby} from '@docusaurus/utils';

// Recursively get the final routes (routes with no subroutes)
export function getAllFinalRoutes(routeConfig: RouteConfig[]): RouteConfig[] {
  function getFinalRoutes(route: RouteConfig): RouteConfig[] {
    return route.routes ? route.routes.flatMap(getFinalRoutes) : [route];
  }
  return routeConfig.flatMap(getFinalRoutes);
}

// Globby that fix Windows path patterns
// See https://github.com/facebook/docusaurus/pull/4222#issuecomment-795517329
export async function safeGlobby(
  patterns: string[],
  options?: Globby.GlobbyOptions,
): Promise<string[]> {
  // Required for Windows support, as paths using \ should not be used by globby
  // (also using the windows hard drive prefix like c: is not a good idea)
  const globPaths = patterns.map((dirPath) =>
    posixPath(path.relative(process.cwd(), dirPath)),
  );

  return Globby(globPaths, options);
}
