import {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    filtersFetching,
    filtersFetched,
    filtersFetchingError,
    addHero,
    removeHero
} from "./actions";

export const fetchHeroes = (request) => (dispatch) => {
    dispatch(heroesFetching());
    request("http://localhost:3001/heroes")
        .then(data => dispatch(heroesFetched(data)))
        .catch(() => dispatch(heroesFetchingError()))
}

export const fetchFilters = (request) => (dispatch) => {
    dispatch(filtersFetching());
    request("http://localhost:3001/filters")
        .then(data => dispatch(filtersFetched(data)))
        .catch(() => dispatch(filtersFetchingError()))
}

export const fetchHeroesAdd = (request, formData) => (dispatch) => {
    request("http://localhost:3001/heroes", 'POST', JSON.stringify(formData))
        .then(res => console.log(res, 'Successful'))
        .then(dispatch(addHero(formData)))
}

export const fetchHeroesRemove = (request, id) => (dispatch) => {
    request(`http://localhost:3001/heroes/${id}`, 'DELETE')
        .then(res => console.log(res, 'Delete'))
        .then(dispatch(removeHero(id)))
}