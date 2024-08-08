import { IModalData } from "../../types/contracts";
import { View } from "./View";

// Класс ModalView
// Реализует модальное окно. Так же предоставляет методы `open`, `close` и `render` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа. 
// interface IModalData{
//   content: HTMLElement|View;
// }
// ```
// class ModalView extends View<IModalData> {
//  open(): void;
//  close(): void;
//  render(data: Partial<IModalData>){
//     ... // отображение дочернего View}
// }

export class ModalView extends View<IModalData> {
  open(): void {
    this.element.classList.add('modal_active');
  };

  close(): void {
    this.element.classList.remove('modal_active');
  };

  render(data: Partial<IModalData>) {

    this.element.querySelector('.modal__content')!.textContent = 'popa';

    return this.element;
  }
}
