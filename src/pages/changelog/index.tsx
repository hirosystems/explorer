import React from 'react';
import { Box, Flex, Stack, color } from '@stacks/ui';
import { Pre, Text, Title } from '@components/typography';
import { Meta } from '@components/meta-head';
import { NextPage } from 'next';
import { Section } from '@components/section';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import hydrate from 'next-mdx-remote/hydrate';
import renderToString from 'next-mdx-remote/render-to-string';


// @ts-ignore
import remarkImages from 'remark-images';
// @ts-ignore
import remarkUnwrapImages from 'remark-unwrap-images';
import rehypeImages from '@common/lib/rehype-images';
import { css, Theme } from '@stacks/ui-core';
import { border, toRelativeTime } from '@common/utils';



const ChangelogPage: NextPage = ({ posts }: any) => {
  return (
    <>
      <Meta title="Changelog" />
      <Box mb="base-loose">
        <Title mt="72px" color="white" as="h1" fontSize="36px">
          Changelog
        </Title>
        <Section minHeight="600px">
          <Box
            css={(theme: Theme) =>
              css({
                '* + h1, * + h2, * + h3, * + h4, * + h5, * + h6': {
                  marginTop: '50px',
                },
              })(theme)
            }
            p="extra-loose"
          >
            {posts.map((post: any, index: number) => {
              return (

              );
            })}
          </Box>
        </Section>
      </Box>
    </>
  );
};

export async function getStaticProps() {
  const POSTS = path.join(process.cwd(), 'src', 'pages', 'changelog', 'entries');
  const postFilePaths = fs.readdirSync(POSTS).filter(path => /\.mdx?$/.test(path));

  const posts = await Promise.all(
    postFilePaths.map(async filePath => {
      const source = fs.readFileSync(path.join(POSTS, filePath));
      const { content, data } = matter(source);

      const mdxSource = await renderToString(content, {
        components,
        mdxOptions: {
          remarkPlugins: [remarkImages, remarkUnwrapImages],
          rehypePlugins: [rehypeImages],
        },
      });

      return {
        content: mdxSource,
        data,
        filePath,
      };
    })
  );

  return { props: { posts } };
}

export default ChangelogPage;
