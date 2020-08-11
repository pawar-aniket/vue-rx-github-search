<template>
  <div>
    <form v-stream:submit.prevent="formSubmitSubject$">
      <input v-model="searchQuery">
      <button>Search</button>
    </form>
    <br>
    <br>
    <p v-if="isSearching">Searching for your results. Please wait...</p>
    <div v-if="repos && !isSearching" class="search-results">
      <div class="search-header">
        <span class="search-count">
          <b>{{ repos.total_count }}</b> repository results
        </span>

        <div class="sort-section">
          <span>Sort:</span>
          <select v-model="sort" v-stream:change="sort$">
            <option value>Best Match</option>
            <option value="stars">Most Stars</option>
            <option value="forks">Most Forks</option>
            <option value="updated">Recently Updated</option>
          </select>
        </div>
      </div>

      <ul v-for="repo in repos.items" :key="repo.id">
        <div>
          <li>{{ repo.full_name }} - {{ repo.stargazers_count }}</li>
        </div>
      </ul>
    </div>
  </div>
</template>

<style>
.search-header {
  display: flex;
}
.search-count {
  flex: 1;
}
.sort-section {
  flex: 1;
}
</style>

<script>
import { GithubService } from "./GithubService.js";
import { combineLatest, of } from "rxjs";
import { tap, map, startWith, switchMap, filter } from "rxjs/operators";
export default {
  domStreams: ["sort$", "formSubmitSubject$"],
  subscriptions() {
    const sort = this.sort$.pipe(
      map(({ event }) => event.target.value),
      startWith("")
    );

    const searchForm = this.formSubmitSubject$.pipe(
      filter(() => this.searchQuery.length),
      map(() => this.searchQuery.split(" ").join("+"))
    );

    const repos = combineLatest(searchForm, sort).pipe(
      switchMap(([searchQuery, sort]) => {
        this.isSearching = true;
        return GithubService.searchRepositories(searchQuery, sort).pipe(
          tap(() => (this.isSearching = false))
        );
      })
    );

    // TO DO - PAGINATION

    return {
      searchQuery: of(""),
      isSearching: of(false),
      repos,
      sort
    };
  }
};
</script>