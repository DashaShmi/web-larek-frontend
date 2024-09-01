// Хорошая практика даже простые типы выносить в алиасы

import { IEventScheme } from "./IEventScheme";

// Зато когда захотите поменять это достаточно сделать в одном месте
type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
    eventName: string,
    data: unknown
};


export interface IEvents extends IGenericEvents<IEventScheme> {

}

export interface IGenericEvents<T extends Record<keyof T, UnknownFunc>> {
    on<K extends keyof T>(eventName: K, func: T[K]): boolean;
    off<K extends keyof T>(eventName: K, func: T[K]): boolean;
    offAll(): void;
    emit<K extends keyof T>(eventName: K, ...params: Parameters<T[K]>): boolean;
    emitDynamic<T>(eventName: string, value: T): boolean;
}

export type UnknownFunc = (...args: never[]) => unknown;

/**
 * Брокер событий, классическая реализация
 * В расширенных вариантах есть возможность подписаться на все события
 * или слушать события по шаблону например
 */
export class EventEmitter<T extends Record<keyof T, UnknownFunc>> implements IGenericEvents<T> {
    private readonly _actions: {
        [K in keyof T]?: T[K][];
    } = {};

    constructor() {
    }

    /**
     * Установить обработчик на событие
     */
    on<K extends keyof T>(eventName: K, func: T[K]): boolean {
        let actionFunctions: T[K][] | undefined = this._actions[eventName];

        if (actionFunctions === undefined) {
            const newArr: T[K][] = []; // ts fix
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
    off<K extends keyof T>(eventName: K, func: T[K]): boolean {
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
        ...params: Parameters<T[K]>
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

    /*
        для отправки событий без проверки
    */
    emitDynamic<T>(eventName: string, ...params: any): boolean {
        return this.emit(eventName as any, ...params as any);
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

