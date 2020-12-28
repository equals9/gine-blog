import React from 'react';
import { NotionAPI } from 'notion-client';
import { NotionRenderer } from 'react-notion-x';
import Head from 'next/head';
import { getPosts, PostTagList } from '..';
import styled from 'styled-components';
import { Layout } from '../../components/layout';
import { GetStaticProps } from 'next'
import Disqus from 'disqus-react';

const notion = new NotionAPI()


export const getStaticProps: GetStaticProps = async (context) => {
    const pageId = context.params.slug as string;
    const recordMap = await notion.getPage(pageId);
    const posts = await getPosts();
    const post = posts.find(post => (post.id as string).split("-").join("") === context.params.slug);
    return {
        props: {
            recordMap,
            pageId,
            pageMeta: post,
        },
        revalidate: 1000
    }
}


export async function getStaticPaths() {
    const posts = await getPosts();
    const res = {
        paths: posts.map((post) => {
            const postSlug = (post.id as string).split("-").join("");
            return {
                params: {
                    slug: postSlug,
                },
            }
        }),
        fallback: false
    }
    return res;
}

const PageHeather = styled.div`
    margin: 2px auto;
    max-width: 700px;
`;

function NotionPage({ recordMap, pageId, pageMeta }) {
    if (!recordMap) {
        return <span>{pageId}</span>
    }
    const { tags, name, public_date } = pageMeta;
    const disqusShortname = "maynes-blog";
    const disqusConfig = {
        url: window.location.href,
        identifier: window.location.pathname,
        title: name,
    }
    return (
        <>
            <Head>
                <meta name='description' />
                <title>{name}</title>
            </Head>
            <div>
                <PageHeather>
                    <h2>
                        {name}
                    </h2>
                    <PostTagList tags={tags} publicDate={public_date} />
                </PageHeather>
                <NotionRenderer recordMap={recordMap} fullPage={false} darkMode={false} />
                <Disqus.DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
            </div>
        </>
    )
}

NotionPage.Layout = Layout;
export default NotionPage;