const baseUrl =  `${process.env.BACKEND_DOMAIN}`;
export const BackendEndpoints = {
    baseUrl,
    createTopic :  baseUrl + '/topics/create',
    fetchTopics : baseUrl + '/topics/all'
}