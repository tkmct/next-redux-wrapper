import React from 'react';
import {Provider} from 'react-redux';
import App, {Container} from 'next/app';
import withRedux from 'next-redux-wrapper';
import {makeStore} from '../components/store';
import Layout from '../components/layout';

export default withRedux(makeStore, {debug: true})(
    class MyApp extends App<any> {
        public static async getInitialProps({Component, ctx}) {
            // Keep in mind that this will be called twice on server, one for page and second for error page
            await new Promise<any>(res => {
                setTimeout(() => {
                    ctx.store.dispatch({type: 'TOE', payload: 'was set in _app'});
                    res();
                }, 200);
            });

            return {
                pageProps: {
                    // Call page-level getInitialProps
                    ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
                    // Some custom thing for all pages
                    pathname: ctx.pathname,
                },
            };
        }

        public render() {
            const {Component, pageProps, store} = this.props;
            return (
                <Container>
                    <Provider store={store}>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </Provider>
                </Container>
            );
        }
    },
);
