import {BehaviorSubject} from 'rxjs';

export const currentTxStore = {
  currentTx: new BehaviorSubject(null),
  currentTxValue: new BehaviorSubject(null),

  setCurrentTx(tx, val) {
    currentTxStore.currentTx.next(tx)
    currentTxStore.currentTxValue.next(val)
  },
}
