import React from "react";
import Spinner from "../spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "../../hooks/http.hook";
import { filterHeroes } from "../../actions/actions";
import classNames from "classnames";
import { fetchFilters } from "../../actions/asyncActions";

// ? Задача для этого компонента:
// * done Фильтры должны формироваться на основании загруженных данных
// * done Фильтры должны отображать только нужных героев при выборе
// * done Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО! Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {

    const dispatch = useDispatch()
    const { filters, filtersLoadingStatus, currentFilter } = useSelector(state => state.filtersReducer)

    const { request } = useHttp()

    React.useEffect(() => {
        dispatch(fetchFilters(request))
        // eslint-disable-next-line
    }, []);

    if (filtersLoadingStatus === "loading") {
        return <Spinner />;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderButton = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Фильтров пока нет</h5>
        }

        return (
            arr.map(({ name, label, className }) => {
                const btnClass = classNames('btn', `${className}`, { 'active': currentFilter === name })

                return (
                    <button key={name} className={btnClass} onClick={() => dispatch(filterHeroes(name))}>{label}</button>
                )
            })
        )
    }

    const buttons = renderButton(filters)

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {buttons}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;