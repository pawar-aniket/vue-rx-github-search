import { fromFetch } from "rxjs/fetch";
import { of } from "rxjs";
import { switchMap, catchError } from "rxjs/operators";

const GITHUB_API_ENDPOINT = "https://api.github.com";

export const GithubService = {
  searchRepositories(searchQuery, sort) {
    return fromFetch(
      `${GITHUB_API_ENDPOINT}/search/repositories?q=${searchQuery}${
        sort ? `&sort=${sort}` : ``
      }`
    ).pipe(
      switchMap((response) => {
        if (response.ok) {
          return response.json();
        }
        return of({});
      }),
      catchError((err) => {
        // Network or other error, handle appropriately
        return of({ error: true });
      })
    );
  }
};
