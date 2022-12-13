import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import { fetchHeroesAdd } from "../../actions/asyncActions";
import { useHttp } from "../../hooks/http.hook";

// ? Задача для этого компонента:
// * done Реализовать создание нового героя с введенными данными. Он должен попадать в общее состояние и отображаться в списке
// * done Уникальный идентификатор персонажа можно сгенерировать через uiid
// * done Герой должен фильтроватся в списке фильтроваться
// ! Усложненная задача:
// * done Персонаж создается и в файле json при помощи метода POST
// TODO Дополнительно:
// * done Элементы <option></option> желательно сформировать на базе данных из фильтров

const HeroesAddForm = () => {

    const initialFormData = { id: '', name: '', description: '', element: '' }

    const [formData, setFormData] = React.useState(initialFormData)
    const [formErrors, setFormErrors] = React.useState({})
    const [isSubmit, setIsSubmit] = React.useState(false)

    const dispatch = useDispatch()
    const { filters, filtersLoadingStatus } = useSelector(state => state.filtersReducer)

    const { request } = useHttp()

    const onHandleChange = (e) => {
        // setFormData({ [event.target.name]: event.target.value })
        const { name, value } = e.target

        setFormData({ ...formData, [name]: value })
    }

    const validate = (formData) => {
        const errors = {}

        if (!formData.name) {
            errors.name = 'Name is required'
        }
        if (!formData.description) {
            errors.description = 'Description is required'
        } else if (formData.description.length < 5) {
            errors.description = 'Description can not be less then 5 characters'
        }
        if (formData.element === 'Я владею элементом...' || formData.element === '') {
            errors.element = 'Chose element'
        }

        return errors
    }

    const onSubmit = (e) => {
        e.preventDefault()
        setFormErrors(validate(formData))
        setIsSubmit(true)
        setFormData({ ...formData, id: uuidv4() })
    }

    React.useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            dispatch(fetchHeroesAdd(request, formData))

            setFormData(initialFormData)
        }
        // eslint-disable-next-line
    }, [formErrors, isSubmit])

    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option>Загрузка элементов</option>
        } else if (status === "error") {
            return <option>Ошибка загрузки</option>
        }

        if (filters && filters.length > 0) {
            return filters.map(({ name, label }) => {
                // eslint-disable-next-line
                if (name === 'all') return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <form className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input
                    required
                    type="text"
                    name="name"
                    className="form-control"
                    id="name"
                    placeholder="Как меня зовут?"
                    value={formData.name}
                    onChange={onHandleChange} />
                {formErrors.name ? (<p className="alert alert-danger p-2">{formErrors.name}</p>) : null}
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="description"
                    className="form-control"
                    id="text"
                    placeholder="Что я умею?"
                    style={{ "height": '130px' }}
                    value={formData.description}
                    onChange={onHandleChange} />
                {formErrors.description ? (<p className="alert alert-danger p-2">{formErrors.description}</p>) : null}
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select
                    required
                    className="form-select"
                    id="element"
                    name="element"
                    value={formData.element}
                    onChange={onHandleChange}>
                    <option >Я владею элементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
                {formErrors.element ? (<p className="alert alert-danger p-2">{formErrors.element}</p>) : null}
            </div>

            <button type="submit" className="btn btn-primary" onClick={onSubmit}>Создать</button>
        </form>
    )
}

export default HeroesAddForm;