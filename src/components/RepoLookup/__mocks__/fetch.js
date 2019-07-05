const mockRepos = [
    {
        id: 0,
        name: 'Repo 0'
    },
    {
        id: 1,
        name: 'Repo 1'
    },
    {
        id: 2,
        name: 'Repo 2'
    },
    {
        id: 3,
        name: 'Repo 3'
    },
    {
        id: 4,
        name: 'Repo 4'
    }
];

const mockFetch = jest.fn(() => { return Promise.resolve(mockRepos) });


module.exports = { mockFetch };