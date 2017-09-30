export default {
    protocol: 'http',
    url: '37.139.31.245',
    port: 5000,
    getUrl() {
        return this.protocol + '://' + this.url + ':' + this.port;
    },
    appendPath(a: string) {
        return this.getUrl() + '/' + a;
    }
};
