"use strict";
// в данных задачах нужно использовать возможности es6
// ко всем заданиям можно дописать свои тесты в файле es6.spec.js
// Можно менять параметры функций (например сделать им значения по умолчанию)

// Напишите функцию, которая принимает ФИО пользователя и возвращает
// строку формата Имя Фамилия
function fioToName(fio) {
    if (fio === '') {
        return '';
    }

    let fioSplitArray = fio.split(' ');
    if (fioSplitArray.length == 1) {
        return `${fioSplitArray[0]}`;
    }
    return `${fioSplitArray[1]} ${fioSplitArray[0]}`;
}

// преобразуйте массив чисел так, чтобы в нем остались только
// уникальные элементы
// присмотритесь к коллекции "Set"
function filterUnique(array) {
    let tempSet = new Set(array);
    return Array.from(tempSet);
}

// Задача: разница зарплат
// в функцию приходит массив из n зарплат сотрудников фирмы
// ваша задача определить, во сколько раз зарплата самого высокооплачиваемого
// сотрудника превышает зарплату самого низкооплачиваемого
// присмотритесь к методу .reduce
function calculateSalaryDifference(array) {
    if (!Array.isArray(array) || array.length < 2) {
        return null;
    }

    let [lowest, highest] = array.reduce(([lowest, highest], current) => {
        if (lowest > current) {
            lowest = current;
        }
        if (highest < current) {
            highest = current;
        }
        return [lowest, highest];
    }, [array[0], array[0]]);

    return highest/lowest;
}

// Реализуйте класс "словарь слов" (как толковый словарь)
// класс должен быть безопасным и работать только со словами
// присмотритесь к коллекции "Map"
// Словарь - (string, string), и все это не null и не undefined
// * покройте класс тестами
class Dictionary {
    #innerCol = new Map();

    constructor(obj = {}) {
        if (typeof(obj) !== 'object' || Object.keys(obj).length === 0) {
            return;
        } else {
            this.#innerCol = new Map(Object.entries(obj));
        }
    }

    static isString(obj) {
        if (obj === undefined || obj === null || typeof(obj) !== 'string') {
            return false;
        }
        return true;
    }

    get(term) {
        if (!Dictionary.isString(term)) {
            return;
        }
        return this.#innerCol.get(term);
    }

    set(term, definition) {
        if (!Dictionary.isString(term) || !Dictionary.isString(definition)) {
            return;
        }

        this.#innerCol.set(term, definition);
    }

    add(term, definition) {
        if (!Dictionary.isString(term) || !Dictionary.isString(definition)) {
            return;
        }

        this.#innerCol.set(term, definition);
    }

    remove(term) {
        if (!Dictionary.isString(term)) {
            return;
        }
        
        this.#innerCol.delete(term);
    }

    containsKey(term) {
        if (!Dictionary.isString(term)) {
            return false;
        }

        return this.#innerCol.has(term);
    }

    containsValue(definition) {
        if (!Dictionary.isString(definition)) {
            return false;
        }

        for (let [key, value] of this.#innerCol) {
            if (value === definition) {
                return true;
            }
        }
    }

    clear() {
        this.#innerCol.clear();
    }

    get count() {
        return this.#innerCol.size;
    }

    get length() {
        return this.#innerCol.size;
    }
}

module.exports = {
    fioToName,
    filterUnique,
    Dictionary,
    calculateSalaryDifference
};