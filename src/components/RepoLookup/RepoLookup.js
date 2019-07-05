import React from 'react';

export default class RepoLookup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: false,
            nameInput: props.nameInput || '',
            name: props.name || '',
            message: props.message || '',
            results: props.results || [],
            lookupType: 'orgs',
        }
        this.nameInput = React.createRef();
    }

    handleLookup = (event) => {
        event.preventDefault();
        this.setState({ fetching: true });
        let type = this.state.lookupType
        let name = this.nameInput.current.value;
        fetch(`https://api.github.com/${type}/${name}/repos?type=${type === 'orgs' ? 'public' : 'owner'}`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ fetching: false });
                    if (Array.isArray(result)) {
                        this.setState({ name, results: result, message: '' });
                    } else if (result.message) {
                        this.setState({ message: `'${this.nameInput.current.value}' ${result.message}` });
                    } else {
                        this.setState({ message: 'Unknown Error' });
                    }
                },
                (error) => {
                    this.setState({ fetching: false });
                    console.log('error', error);
                }
            );
    }

    getTypeSelect = () => (
        <label>
            <span className="selectLabel">Lookup Type</span>
            <select id="typeInput" className="select" value={this.state.lookupType} onChange={(event) => { this.setState({ lookupType: event.target.value }) }}>
                <option value="orgs">Organization</option>
                <option value="users">User</option>
            </select>
        </label>
    );

    getMessage = () => {
        if (this.state.message.length === 0) {
            return (<p></p>);
        }
        return (
            <article id="message">
                <p>{this.state.message}</p>
            </article>
        )
    }
    

    getResults = () => (
        <article id="results" className={this.state.results.length > 0 ? '' : 'hide'}>
            <h2>Repositories for {this.state.name}</h2>
            { this.state.results.length > 0 && this.repoList() }
        </article>
    )

    repoList = () => {
        const results = this.state.results;
        const repos = results.map((repo) =>
            <li key={repo.id.toString()}>
                <h3>{repo.name}</h3>
                <div className="details">
                    <span className="repoWatchers">{repo.watchers} watchers</span>
                    <span className="repoIssues">{repo.open_issues} open issues</span>
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">View</a>
                </div>
            </li>
        )
        return (
            <ul id="resultsList">{repos}</ul>
        )
    }

    //todo: create presentation component for rendering the resulting repos in <ul></ul>
    //todo: style
    //todo: stretch (username/org switch?)

    render() {
        return (
            <section>
                <form onSubmit={this.handleLookup}>
                    <label className="messageWrap">
                        <input id="nameInput" type="text" ref={this.nameInput} onChange={e => this.setState({ nameInput: e.target.value })} aria-label="Enter Name" placeholder="Enter Name" />
                        {this.getMessage()}
                    </label>
                    <div className="fieldRow">
                        <div>
                            {this.getTypeSelect()}
                        </div>
                        <div>
                            <input id="lookupButton" type="submit" value="Lookup" disabled={this.state.fetching || this.state.nameInput.length < 1} />
                        </div>
                    </div>
                </form>
                {this.getResults()}
            </section>
        )
    }
}