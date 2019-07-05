import React from 'react';
import ReactDOM from 'react-dom';
import RepoLookup from './RepoLookup';
import ReactTestUtils from 'react-dom/test-utils';
// import mockFetch from './__mocks__/fetch';

let container, event, repos;
// jest.mock('fetch');

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    event = {
        preventDefault: () => {}
    }
    repos = [
        {   
            id: 0,
            url: '#',
            watchers: 20,
            name: 'test repo 0',
            open_issues: 2
        },
        {
            id: 1,
            url: '#',
            watchers: 180,
            name: 'test repo 1',
            open_issues: 25
        },
        {
            id: 2,
            url: '#',
            watchers: 0,
            name: 'test repo 2',
            open_issues: 0
        }
    ];
});

afterEach(() => {
    document.body.removeChild(container);
    container = event = null;
});

test('lookup button disabled before input', () => {
    ReactDOM.render(<RepoLookup />, container);
    const button = container.querySelector('#lookupButton');
    expect(button.disabled).toBe(true);
});

test('lookup button enabled after input', () => {
    ReactDOM.render(<RepoLookup />, container);
    let input = container.querySelector('#nameInput');
    const button = container.querySelector('#lookupButton');
    input.value = 'Test';
    ReactTestUtils.Simulate.change(input);
    expect(button.disabled).toBe(false);
    
});

test('selecting organization sets typeSelect to orgs', () => {
    const component = ReactDOM.render(<RepoLookup />, container);
    component.setState({ lookupType: 'users' });
    let select = container.querySelector('#typeInput');
    select.value = 'orgs'
    ReactTestUtils.Simulate.change(select);
    expect(component.state.lookupType).toEqual('orgs');
});

test('selecting user sets typeSelect to users', () => {
    const component = ReactDOM.render(<RepoLookup />, container);
    component.setState({ lookupType: 'orgs' });
    let select = container.querySelector('#typeInput');
    select.value = 'users'
    ReactTestUtils.Simulate.change(select);
    expect(component.state.lookupType).toEqual('users');
});

test('renders results when state.results is not empty', () => {
    const component = ReactDOM.render(<RepoLookup />, container);
    component.setState({ results: repos });
    let results = container.querySelector('#resultsList');
    expect(!!results).toEqual(true);
});

test('hides results when state.results is empty', () => {
    const component = ReactDOM.render(<RepoLookup />, container);
    component.setState({ results: [] });
    let results = container.querySelector('#resultsList');
    expect(!!results).toEqual(false);
});

test('renders message when state.message is not empty', () => {
    const component = ReactDOM.render(<RepoLookup />, container);
    component.setState({ message: 'Test Message' });
    let message = container.querySelector('#message');
    expect(!!message).toEqual(true);
});

test('renders message when state.message is not empty', () => {
    const component = ReactDOM.render(<RepoLookup />, container);
    component.setState({ message: '' });
    let message = container.querySelector('#message');
    expect(!!message).toEqual(false);
});

xtest('handleLookup fetches data from server when server returns a successful response', () => {
    //set up fetch mock
    const mockSuccessResponse = [
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
        }
    ];
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const mockFetchPromise = Promise.resolve({ // 3
        json: () => mockJsonPromise,
    });
    jest.spyOn(global, 'fetch').mockImplementation(mockFetchPromise);

    //set up component
    const component = ReactDOM.render(<RepoLookup />, container);
    const input = container.querySelector('#nameInput');
    input.value = 'TestOrg';
    ReactTestUtils.Simulate.change(input);

    //call func
    component.handleLookup(event);

    //set expectations
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('https://api.github.com/orgs/TestOrg/repos');
    process.nextTick(() => {
        expect(component.state).toEqual({
        fetching: false,
        nameInput: "TestOrg",
        name: "TestOrg",
        message: '',
        results: [
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
            }
        ]
        });

        global.fetch.mockClear();
        done();
    });
});