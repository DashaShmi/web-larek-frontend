// Хорошая практика даже простые типы выносить в алиасы

import { IEventScheme } from "./IEventScheme";


export interface IEvents extends IGenericEvents<IEventScheme> {

}

export type ToArrayOfParams<T> = T extends void ? [] : [data: T];

type Listener<T> = (...args: ToArrayOfParams<T>) => void;

export interface IGenericEvents<T extends Record<keyof T, unknown>> {
    on<K extends keyof T>(eventName: K, func: Listener<T[K]>): boolean;
    off<K extends keyof T>(eventName: K, func: Listener<T[K]>): boolean;
    offAll(): void;
    emit<K extends keyof T>(eventName: K, ...params: ToArrayOfParams<T[K]>): boolean;
}

/**
 * Брокер событий, классическая реализация
 * В расширенных вариантах есть возможность подписаться на все события
 * или слушать события по шаблону например
 */
export class EventEmitter<T extends Record<keyof T, []>> implements IGenericEvents<T> {
    private readonly _actions: {
        [K in keyof T]?: Listener<T[K]>[];
    } = {};

    constructor() {
    }

    /**
     * Установить обработчик на событие
     */
    on<K extends keyof T>(eventName: K, func: Listener<T[K]>): boolean {
        let actionFunctions: Listener<T[K]>[] | undefined = this._actions[eventName];

        if (actionFunctions === undefined) {
            const newArr: Listener<T[K]>[] = []; // ts fix
            this._actions[eventName] = newArr;
            actionFunctions = newArr;
        }

        if (actionFunctions.indexOf(func) >= 0) {
            return false;
        }

        actionFunctions.push(func);

        return true;
    }

    /**
     * Снять обработчик с события
     */
    off<K extends keyof T>(eventName: K, func: Listener<T[K]>): boolean {
        const actionFunctions = this._actions[eventName];

        if (actionFunctions === undefined) {
            return false;
        }

        const actionIndex = actionFunctions.indexOf(func);

        if (actionIndex < 0) {
            return false;
        }

        actionFunctions.splice(actionIndex, 1);
        return true;
    }

    /**
     * Инициировать событие с данными
     */
    emit<K extends keyof T>(
        eventName: K,
        ...params: ToArrayOfParams<T[K]>
    ): boolean {
        if (this._actions[eventName] === undefined) {
            return false;
        }

        const actions = this._actions[eventName] ?? [];

        for (const action of actions) {
            if (action === undefined || action === null) {
                continue;
            }

            action(...params);
        }

        return true;
    }


    /**
     * Слушать все события
     */
    // onAll(callback: (event: EmitterEvent) => void) {
    //     this.on("*", callback);
    // }

    /**
     * Сбросить все обработчики
     */

    // clear all subscriptions
    offAll(): void {
        for (const key in this._actions) {
            delete this._actions[key];
        }
    }

    /**
     * Сделать коллбек триггер, генерирующий событие при вызове
     */
    // trigger<T extends object>(eventName: string, context?: Partial<T>) {
    //     return (event: object = {}) => {
    //         this.emit(eventName, {
    //             ...(event || {}),
    //             ...(context || {})
    //         });
    //     };
    // }
}

