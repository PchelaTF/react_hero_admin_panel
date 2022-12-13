import { useHttp } from '../../hooks/http.hook';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect'
import { fetchHeroes, fetchHeroesRemove } from '../../actions/asyncActions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import { CSSTransition, TransitionGroup, } from 'react-transition-group';
import './HeroesList.scss'

// ? Задача для этого компонента:
// * done При клике на "крестик" идет удаление персонажа из общего состояния
// * done Анимация появления при добавлении и исчезновения при удалени персонажа 
// ! Усложненная задача:
// * done Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {

    const dispatch = useDispatch();
    const { heroesLoadingStatus } = useSelector(state => state.heroesReducer);

    const { request } = useHttp();

    const heroesSelector = createSelector(
        state => state.heroesReducer.heroes,
        state => state.filtersReducer.currentFilter,
        (heroes, currentFilter) => {
            if (currentFilter === 'all') {
                return heroes
            } else {
                return heroes.filter(hero => hero.element === currentFilter)
            }
        }
    )

    const filteredHeroes = useSelector(heroesSelector)

    React.useEffect(() => {
        dispatch(fetchHeroes(request))
        // eslint-disable-next-line
    }, []);

    const handleDelete = React.useCallback((id) => {
        dispatch(fetchHeroesRemove(request, id))
        // eslint-disable-next-line  
    }, [request])

    if (heroesLoadingStatus === "loading") {
        return <Spinner />;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        return (
            <TransitionGroup component={'ul'}>
                {arr.map(({ id, ...props }) => {
                    return (
                        <CSSTransition key={id} timeout={500} classNames='item'>
                            <HeroesListItem  {...props} handleDelete={() => handleDelete(id)} />
                        </CSSTransition>
                    )
                })}
            </TransitionGroup>
        )
    }

    const elements = renderHeroesList(filteredHeroes);

    return (
        <>
            {elements}
        </>
    )
}

export default HeroesList;  