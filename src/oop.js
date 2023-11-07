/**
 * Напишите класс геометрической точки, принимающей в конструкторе координаты X и Y
 * Если координаты не переданы - 0,0; Аналогично если только 1 координата.
 * Со звездочкой: реализовать метод, который возвращает расстояние от точки до центра координат (0, 0)
 */
class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    calculateDistanceFromStartingPoint() {
        let distance = Math.sqrt(this.x**2 + this.y**2);
        return distance;
    }
}

/**
 * Напишите класс геометрической точки в трехмерном пространстве (x, y, z),
 * который будет наследоваться от точки в двумерном пространстве.
 * Реализовать статический метод, который возвращает расстояние между Point3D.
 */
class Point3D extends Point {
    constructor(x = 0, y = 0, z = 0) {
        super(x, y);
        this.z = z;
    }

    calculateDistanceFromStartingPoint() {
        let distance = Math.sqrt(this.x**2 + this.y**2 + this.z**2);
        return distance;
    }

    static vectorLength(firstPoint3D, secondPoint3D) {
        let distance = Math.sqrt( (firstPoint3D.x - secondPoint3D.x)**2 + 
        (firstPoint3D.y - secondPoint3D.y)**2 + 
        (firstPoint3D.z - secondPoint3D.z)**2 );

        return distance;
    }
}

/**
 * Напишите класс "очередь", в котором можно добавить элемент в конец и получить из начала.
 * Предусмотреть 2 варианта инициализации - массивом в конструкторе (из него создается очередь) и без параметров.
 * Со звездочкой: написать тесты методы класса (oop.spec.js)
 */
class Queue {
    #array = [];

    constructor(array = []) {
        this.#array = [];

        if (array?.length !== 0) {
            if (Array.isArray(array)) {
                for (const element of array) {
                    this.enqueue(element);
                }
                return;
            }
            for (let key in array) {
                this.enqueue(array[key]);
            }
        }
    }

    enqueue(element) {
        this.#array.push(element);
    }

    dequeue() {
        return this.#array.shift();
    }

    peek() {
        return this.#array[0];
    }

    contains(element) {
        return this.#array.find(el => el === element);
    }

    clear() {
        this.#array.clear();
    }

    get count() {
        return this.#array.length;
    }

    get length() {
        return this.#array.length;
    }

    toArray() {
        return this.#array;
    }
}

module.exports = {
    Point,
    Point3D,
    Queue,
};
