import { ActionCreatorWithPayload } from '@reduxjs/toolkit/dist/createAction';
import { store } from '@/store';

//TODO for now use redux for managing semaphores for different rendered follow btns, later on make a getSemaphore functions which returns the same semaphore instance for same components, which wont require redux and would be faster
class Semaphore {
  private waiting: Array<() => void>;
  private updating: boolean;
  private dispatchFunc: ActionCreatorWithPayload<boolean>;

  constructor(updating: boolean, dispatchFunc: ActionCreatorWithPayload<boolean>) {
    this.updating = updating;
    this.dispatchFunc = dispatchFunc;
    this.waiting = [];
  }

  async acquire() {
    if (!this.updating) {
      store.dispatch(this.dispatchFunc(true));
    } else {
      await new Promise<void>(resolve =>
        this.waiting.push(() => {
          this.acquire();
          resolve();
          this.release();
        })
      );
    }
  }

  release() {
    store.dispatch(this.dispatchFunc(false));
    const next = this.waiting.shift();
    if (next) {
      next(); //! not working
    }
  }
}

export default Semaphore;
