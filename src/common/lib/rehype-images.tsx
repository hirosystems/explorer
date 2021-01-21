// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import memoize from 'micro-memoize';
import visit from 'unist-util-visit';
import pAll from 'p-all';
import sizeOf from 'image-size';

/**
 * Simple plugin to get the size of local images so we can use it in react
 */
const rehypeImageSize = () => {
  async function transformer(tree) {
    const nodes = [];
    visit(tree, 'element', node => {
      if (node.tagName !== 'img') {
        return;
      } else {
        nodes.push(node);
      }
    });
    await pAll(
      nodes.map(node => () => visitor(node)),
      { concurrency: 25 }
    );
    return tree;
  }

  async function visitor(node) {
    const isRelative =
      node && node.properties && node.properties.src && node.properties.src.startsWith('/');
    if (isRelative) {
      const dimensions = sizeOf(`public/${node.properties.src}`);
      node.properties['dimensions'] = dimensions;
    }
  }

  return transformer;
};

export default memoize(rehypeImageSize);
